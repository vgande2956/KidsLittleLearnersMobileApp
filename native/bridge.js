import { Capacitor, registerPlugin } from '@capacitor/core';

const ACTIONS = {
  '/api/auth/login': 'login',
  '/api/auth/signup': 'signup',
  '/api/auth/session': 'session',
  '/api/auth/logout': 'logout',
  '/api/auth/resend-verification': 'resendVerification',
  '/api/auth/forgot-password': 'forgotPassword',
};

// On the device, account calls go through the native plugin so the backend's
// HttpOnly session cookie is stored natively and shared with the website's users.
if (Capacitor.isNativePlatform()) {
  const NativeAuth = registerPlugin('NativeAuth');
  const webFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, window.location.href);
    const action = ACTIONS[url.pathname];
    if (!action) return webFetch(input, init);

    if (init.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    let data = {};
    if (init.body) {
      try { data = JSON.parse(init.body); } catch { data = {}; }
    }

    const call = NativeAuth.request({ action, data });
    const aborted = init.signal && new Promise((_, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
    const result = await (aborted ? Promise.race([call, aborted]) : call);
    return new Response(JSON.stringify(result.data ?? {}), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  installSpeech();
}

// Android WebView has no Web Speech API, so back it with the device's native text-to-speech.
function installSpeech() {
  const TTS = registerPlugin('TextToSpeech');
  const Piper = registerPlugin('PiperVoice');
  const piperReady = { en: false, te: false };
  const piperVoices = [];
  let voices = [];
  let token = 0;
  let current = null;
  let pending = 0;

  class SpeechSynthesisUtterance {
    constructor(text = '') {
      Object.assign(this, {
        text, lang: '', voice: null, rate: 1, pitch: 1, volume: 1,
        onstart: null, onend: null, onerror: null,
      });
    }
  }

  const synth = {
    onvoiceschanged: null,
    get speaking() { return !!current; },
    get pending() { return pending > 0; },
    paused: false,
    getVoices: () => [...piperVoices, ...voices],
    resume() {},
    pause() {},
    cancel() {
      token++;
      pending = 0;
      const stopped = current;
      current = null;
      Piper.stop().catch(() => {});
      TTS.stop().catch(() => {});
      if (stopped?.onerror) stopped.onerror({ error: 'interrupted' });
    },
    speak(utterance) {
      const myToken = token;
      current = utterance;
      const index = utterance.voice && !utterance.voice.fallback ? voices.indexOf(utterance.voice) : -1;
      const stale = () => myToken !== token || current !== utterance;
      const viaDevice = () => {
        if (stale()) return null;
        utterance.onstart?.({});
        return TTS.speak({
          text: utterance.text,
          lang: utterance.voice?.lang || utterance.lang || 'en-IN',
          rate: Math.min(utterance.rate || 0.76, 0.8),
          pitch: utterance.pitch,
          volume: utterance.volume,
          ...(index >= 0 ? { voice: index } : {}),
          category: 'playback',
          queueStrategy: 0,
        }).then(() => true);
      };
      const lang = utterance.voice?.lang || utterance.lang || 'en-IN';
      const code = lang.toLowerCase().startsWith('te') ? 'te' : lang.toLowerCase().startsWith('en') ? 'en' : '';
      const useDevice = !code || !piperReady[code] || (utterance.voice && !utterance.voice.piper);
      const viaPiper = () => {
        if (stale()) return Promise.resolve(false);
        utterance.onstart?.({});
        return Piper.speak({
          text: utterance.text,
          lang: code,
          speed: 0.55 + 0.5 * Math.min(utterance.rate || 0.76, 0.8),
          pitch: utterance.pitch || 1,
          volume: utterance.volume ?? 1,
        }).then((result) => !result?.cancelled);
      };
      const first = useDevice
        ? Promise.resolve(null)
        : viaPiper().catch(() => null);      first.then((done) => (done === null ? viaDevice() : done)).then((finished) => {
        if (finished && myToken === token && current === utterance) {
          current = null;
          utterance.onend?.({});
        }
      }).catch((error) => {
        if (myToken === token && current === utterance) {
          current = null;
          utterance.onerror?.({ error: String(error?.message || 'synthesis-failed') });
        }
      });
    },
  };
  window.speechSynthesis = synth;
  window.SpeechSynthesisUtterance = SpeechSynthesisUtterance;

  const fallbackVoices = ['en-IN', 'te-IN', 'hi-IN'].map((lang) => ({
    voiceURI: lang, name: `Device ${lang}`, lang, localService: true, default: lang === 'en-IN', fallback: true,
  }));
  const loadVoices = (attempt = 0) => {
    TTS.getSupportedVoices().then(({ voices: list = [] }) => {
      if (!list.length && attempt < 3) {
        setTimeout(() => loadVoices(attempt + 1), 700);
        return;
      }
      voices = list.length
        ? list.map((voice) => ({
          voiceURI: voice.voiceURI, name: voice.name, lang: voice.lang, localService: true, default: !!voice.default,
        }))
        : fallbackVoices;
      synth.onvoiceschanged?.();
    }).catch(() => {
      voices = fallbackVoices;
      synth.onvoiceschanged?.();
    });
  };
  loadVoices();
  Piper.prepare().then((ready) => {
    for (const code of ['en', 'te']) {
      piperReady[code] = !!ready?.[code];
      if (piperReady[code]) {
        const lang = code === 'te' ? 'te-IN' : 'en-IN';
        piperVoices.push({ voiceURI: 'piper-' + code, name: 'Little Learners Piper (' + lang + ')', lang, localService: true, default: false, piper: true });
      }
    }
    if (piperVoices.length) synth.onvoiceschanged?.();
  }).catch(() => {});
}
