import { Capacitor, registerPlugin } from '@capacitor/core';

const ACTIONS = {
  '/api/auth/login': 'login',
  '/api/auth/signup': 'signup',
  '/api/auth/session': 'session',
  '/api/auth/logout': 'logout',
  '/api/auth/resend-verification': 'resendVerification',
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
  let voices = [];
  let queue = Promise.resolve();
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
    getVoices: () => voices,
    resume() {},
    pause() {},
    cancel() {
      token++;
      pending = 0;
      const stopped = current;
      current = null;
      queue = queue.then(() => TTS.stop().catch(() => {}));
      if (stopped?.onerror) stopped.onerror({ error: 'interrupted' });
    },
    speak(utterance) {
      const myToken = token;
      pending++;
      queue = queue.then(async () => {
        pending = Math.max(0, pending - 1);
        if (myToken !== token) return;
        current = utterance;
        try {
          utterance.onstart?.({});
          const index = utterance.voice ? voices.indexOf(utterance.voice) : -1;
          await TTS.speak({
            text: utterance.text,
            lang: utterance.voice?.lang || utterance.lang || 'en-IN',
            rate: utterance.rate,
            pitch: utterance.pitch,
            volume: utterance.volume,
            ...(index >= 0 ? { voice: index } : {}),
            category: 'playback',
            queueStrategy: 1,
          });
          if (myToken === token && current === utterance) {
            current = null;
            utterance.onend?.({});
          }
        } catch (error) {
          if (myToken === token && current === utterance) {
            current = null;
            utterance.onerror?.({ error: String(error?.message || 'synthesis-failed') });
          }
        }
      });
    },
  };

  window.speechSynthesis = synth;
  window.SpeechSynthesisUtterance = SpeechSynthesisUtterance;

  TTS.getSupportedVoices().then(({ voices: list = [] }) => {
    voices = list.map((voice) => ({
      voiceURI: voice.voiceURI,
      name: voice.name,
      lang: voice.lang,
      localService: true,
      default: !!voice.default,
    }));
    synth.onvoiceschanged?.();
  }).catch(() => {});
}
