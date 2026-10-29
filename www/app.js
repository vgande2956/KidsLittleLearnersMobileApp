'use strict';

import { Capacitor, registerPlugin } from '@capacitor/core';

const API_ORIGIN = 'https://kidslearningapp-94co.onrender.com';
const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) ? API_ORIGIN : '';
const app = document.querySelector('#app');
const nativeAuth = Capacitor.isNativePlatform() ? registerPlugin('NativeAuth') : null;

const subjects = [
  { id: 'english', icon: '🔤', title: 'English', detail: 'Words, stories & drawing', color: 'pink' },
  { id: 'telugu', icon: '🌼', title: 'తెలుగు Telugu', detail: 'Letters, words & stories', color: 'yellow' },
  { id: 'hindi', icon: '🪷', title: 'हिन्दी Hindi', detail: 'Letters & word practice', color: 'green' },
  { id: 'maths', icon: '🧮', title: 'Maths', detail: 'Numbers, operations & puzzles', color: 'blue' },
  { id: 'general', icon: '🗺️', title: 'General Knowledge', detail: 'Explore India and more', color: 'purple' },
];

const activities = {
  english: [
    ['🔠', 'Alphabets', 'Tap a letter and say its name'],
    ['🐝', 'Two-letter words', 'Read short, friendly words'],
    ['🐈', 'Three-letter words', 'Practice words like cat and sun'],
    ['🕵️', 'Identify words', 'Match pictures to words'],
    ['📖', 'Stories', 'Listen, read and imagine'],
    ['🎨', 'Sketch the diagram', 'Draw and color a picture'],
  ],
  telugu: [
    ['అ', 'Letters & words', 'Explore Telugu letters and examples'],
    ['📖', 'Stories', 'Listen to a story in Telugu'],
    ['🐘', 'Picture questions', 'Practice with picture questions'],
  ],
  hindi: [
    ['अ', 'Letters & words', 'Explore Hindi letters and examples'],
    ['🐘', 'Picture questions', 'Practice with picture questions'],
  ],
  maths: [
    ['➕', 'Addition', 'Put groups together'],
    ['➖', 'Subtraction', 'Take groups away'],
    ['✖️', 'Multiplication', 'Explore equal groups'],
    ['➗', 'Division', 'Practice sharing equally'],
    ['🔢', 'Numbers', 'Learn numbers and counting'],
    ['🏛️', 'Roman numbers', 'Discover Roman numerals'],
  ],
  general: [
    ['🇮🇳', 'States & capitals', 'Explore India’s states and capitals'],
    ['🏛️', 'Prime ministers', 'Meet India’s leaders'],
    ['🗺️', 'National information', 'Learn symbols, places and facts'],
  ],
};

const activityDescriptions = {
  Alphabets: 'Tap a letter to see it, learn an example, and hear its name.',
  'Two-letter words': 'Choose a word to practice saying and spelling it.',
  'Three-letter words': 'Choose a word to practice saying and spelling it.',
  'Identify words': 'Look at the picture, then choose the word that matches.',
  Stories: 'Choose a story to read and listen together.',
  'Sketch the diagram': 'Choose a picture, then draw and color it.',
  'Letters & words': 'Choose a letter to browse its words and pronunciation.',
  'Picture questions': 'Choose the answer that matches the picture.',
  Addition: 'Addition means putting groups together. Try a number sentence!',
  Subtraction: 'Subtraction means taking one group away from another.',
  Multiplication: 'Multiplication helps us count equal groups.',
  Division: 'Practice sharing a total equally into groups.',
  Numbers: 'Choose a number to see it, hear it, and count it.',
  'Roman numbers': 'See how a number is written with Roman numerals.',
  'States & capitals': 'Choose an Indian state to discover its capital.',
  'Prime ministers': 'Meet India’s prime ministers in the order they served.',
  'National information': 'Choose a topic to explore facts about India.',
};

let state = { screen: 'auth', mode: 'login', user: null, subject: null, activity: null, letter: 'A', number: 2 };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function renderBrand() {
  return '<div class="brand"><span class="brand-mark" aria-hidden="true">🐼</span><span>Little Learners</span></div>';
}

function showMessage(text, kind = '') {
  const message = document.querySelector('#auth-message');
  if (!message) return;
  message.textContent = text;
  message.className = `message visible ${kind}`.trim();
}

function renderAuth() {
  const signup = state.mode === 'signup';
  app.innerHTML = `
    <section class="auth-wrap">
      <header class="auth-intro">
        <div class="auth-logo" aria-hidden="true">📚</div>
        <p class="eyebrow">A little learning every day</p>
        <h1>Welcome to<br>Little Learners</h1>
        <p class="subtle">A playful place to learn, listen and explore.</p>
      </header>
      <form class="panel" id="auth-form">
        <div class="tabs" role="tablist" aria-label="Account options">
          <button class="tab ${!signup ? 'active' : ''}" type="button" data-mode="login">Log in</button>
          <button class="tab ${signup ? 'active' : ''}" type="button" data-mode="signup">Create account</button>
        </div>
        ${signup ? `<div class="field"><label for="first-name">First name</label><input id="first-name" name="firstName" autocomplete="given-name" maxlength="80" required></div>` : ''}
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required></div>
        <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="${signup ? 10 : 1}" maxlength="1024" required>${signup ? '<small class="subtle">Use at least 10 characters.</small>' : ''}</div>
        <button class="primary" type="submit">${signup ? 'Create account' : 'Log in'} <span aria-hidden="true">→</span></button>
        ${!signup ? '<button class="secondary" id="resend-button" type="button" style="width:100%;margin-top:10px">Resend confirmation email</button>' : ''}
        <p id="auth-message" class="message" role="status"></p>
        <p class="tiny-note">Use the same account on the Little Learners website or mobile app.</p>
      </form>
    </section>`;

  app.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      renderAuth();
    });
  });
  app.querySelector('#auth-form').addEventListener('submit', onAuthSubmit);
  app.querySelector('#resend-button')?.addEventListener('click', onResend);
}

async function requestAuth(action, data = {}) {
  if (nativeAuth) return nativeAuth.request({ action, data });

  const paths = {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    session: '/api/auth/session',
    logout: '/api/auth/logout',
    resendVerification: '/api/auth/resend-verification',
  };
  const response = await fetch(`${API_BASE_URL}${paths[action]}`, {
    method: action === 'session' ? 'GET' : 'POST',
    credentials: 'include',
    headers: action === 'session' ? {} : { 'Content-Type': 'application/json' },
    body: action === 'session' ? undefined : JSON.stringify(data),
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, data: body };
}

async function onAuthSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  const fields = new FormData(form);
  const data = Object.fromEntries(fields.entries());
  const signup = state.mode === 'signup';
  button.disabled = true;
  button.textContent = signup ? 'Creating your account…' : 'Logging in…';
  try {
    const result = await requestAuth(signup ? 'signup' : 'login', data);
    if (signup && result.status === 202) {
      state.mode = 'login';
      renderAuth();
      showMessage(result.data.message || 'Check your email for a confirmation link.', 'success');
    } else if (!signup && result.status === 200) {
      state.user = result.data;
      state.screen = 'home';
      render();
    } else {
      showMessage(result.data.error || 'We could not complete that request. Please try again.', 'error');
    }
  } catch {
    showMessage('Could not connect to your account service. Check your internet connection and try again.', 'error');
  } finally {
    if (document.querySelector('#auth-form')) {
      const currentButton = document.querySelector('#auth-form [type="submit"]');
      if (currentButton) currentButton.disabled = false;
    }
  }
}

async function onResend() {
  const email = document.querySelector('#email')?.value.trim();
  const password = document.querySelector('#password')?.value;
  if (!email || !password) {
    showMessage('Enter your email and password first, then request another confirmation email.', 'error');
    return;
  }
  try {
    const result = await requestAuth('resendVerification', { email, password });
    showMessage(result.data.message || 'If an unconfirmed account exists, we sent a confirmation email.', 'success');
  } catch {
    showMessage('Could not connect to your account service. Please try again.', 'error');
  }
}

function renderHome() {
  const firstName = state.user?.firstName ? `, ${escapeHtml(state.user.firstName)}` : '';
  app.innerHTML = `
    <header class="topline">${renderBrand()}<button class="icon-button" id="logout-button" aria-label="Log out">↗</button></header>
    <section class="welcome-card">
      <p class="eyebrow">Your learning adventure</p>
      <h1>Hello${firstName}!</h1>
      <p>What would you like to learn today?</p>
    </section>
    <div class="section-heading"><h2>Choose a subject</h2></div>
    <section class="grid" aria-label="Learning subjects">
      ${subjects.map((subject) => `
        <button class="subject-card" data-color="${subject.color}" data-subject="${subject.id}">
          <span class="subject-icon" aria-hidden="true">${subject.icon}</span>
          <strong>${subject.title}</strong><small>${subject.detail}</small>
        </button>`).join('')}
    </section>
    <p class="tiny-note">Your account works with the Little Learners website too.</p>`;
  app.querySelectorAll('[data-subject]').forEach((button) => {
    button.addEventListener('click', () => {
      state.subject = button.dataset.subject;
      state.screen = 'activities';
      render();
    });
  });
  app.querySelector('#logout-button').addEventListener('click', onLogout);
}

function renderActivities() {
  const subject = subjects.find((item) => item.id === state.subject);
  const choices = activities[state.subject] || [];
  app.innerHTML = `
    <header class="topline">${renderBrand()}<button class="icon-button" id="logout-button" aria-label="Log out">↗</button></header>
    <div class="toolbar"><button class="back-button" id="back-button">←&nbsp; Subjects</button></div>
    <p class="eyebrow">Choose how to learn</p><h1>${subject?.title || 'Learning'}</h1>
    <p class="subtle">Pick a fun activity to get started.</p>
    <section class="grid" aria-label="Learning activities">
      ${choices.map(([icon, title, detail]) => `
        <button class="activity-card" data-activity="${escapeHtml(title)}"><span class="subject-icon" aria-hidden="true">${icon}</span><strong>${title}</strong><small>${detail}</small></button>`).join('')}
    </section>`;
  app.querySelector('#back-button').addEventListener('click', () => { state.screen = 'home'; render(); });
  app.querySelectorAll('[data-activity]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activity = button.dataset.activity;
      state.screen = 'lesson';
      render();
    });
  });
  app.querySelector('#logout-button').addEventListener('click', onLogout);
}

function renderLesson() {
  const title = state.activity || 'Learning';
  const isAlphabet = title === 'Alphabets';
  const isMath = ['Addition', 'Subtraction', 'Multiplication', 'Division'].includes(title);
  const description = activityDescriptions[title] || 'Choose a fun activity and learn something new.';
  app.innerHTML = `
    <header class="topline">${renderBrand()}<button class="icon-button" id="logout-button" aria-label="Log out">↗</button></header>
    <div class="toolbar"><button class="back-button" id="back-button">←&nbsp; Activities</button></div>
    <p class="eyebrow">${subjects.find((item) => item.id === state.subject)?.title || 'Learning'}</p>
    <h1>${escapeHtml(title)}</h1>
    <section class="lesson-card">
      <div class="lesson-hero" aria-hidden="true">${isAlphabet ? '🔤' : isMath ? '🧮' : '✨'}</div>
      <p class="subtle">${escapeHtml(description)}</p>
      ${isAlphabet ? renderAlphabetLesson() : isMath ? renderMathLesson(title) : renderActivityPrompt(title)}
    </section>
    <p class="notice">This mobile learning space is built into the app. Account services use the same Little Learners account as the website.</p>`;
  app.querySelector('#back-button').addEventListener('click', () => { state.screen = 'activities'; render(); });
  app.querySelector('#logout-button').addEventListener('click', onLogout);
  app.querySelectorAll('[data-letter]').forEach((button) => {
    button.addEventListener('click', () => { state.letter = button.dataset.letter; render(); });
  });
  app.querySelectorAll('[data-number-change]').forEach((button) => {
    button.addEventListener('click', () => {
      state.number = Math.max(1, Math.min(20, state.number + Number(button.dataset.numberChange)));
      render();
    });
  });
  app.querySelector('#speak-button')?.addEventListener('click', speakCurrent);
}

function renderAlphabetLesson() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letter = state.letter;
  return `<div class="question"><span style="font-size:2rem;color:#a74e78">${letter} ${letter.toLowerCase()}</span><br>${letter} is for ${letter === 'A' ? 'apple' : letter === 'B' ? 'ball' : 'a new word'}.</div>
    <div class="letter-grid">${alphabet.map((item) => `<button class="letter-button ${item === letter ? 'selected' : ''}" data-letter="${item}" aria-label="Letter ${item}">${item}</button>`).join('')}</div>
    <button class="primary" id="speak-button" type="button" style="margin-top:16px">🔊 Hear the letter</button>`;
}

function renderMathLesson(title) {
  const sign = { Addition: '+', Subtraction: '−', Multiplication: '×', Division: '÷' }[title];
  const firstNumber = title === 'Division' ? state.number * 3 : state.number;
  const secondNumber = title === 'Subtraction' ? 1 : 3;
  const answer = title === 'Addition' ? state.number + 3
    : title === 'Subtraction' ? Math.max(0, state.number - 1)
      : title === 'Multiplication' ? state.number * 3 : state.number;
  return `<p class="question">${firstNumber} ${sign} ${secondNumber} = ${answer}</p>
    <div class="number-picker"><button class="secondary" data-number-change="-1" aria-label="Choose a smaller number">−</button><output>${state.number}</output><button class="secondary" data-number-change="1" aria-label="Choose a larger number">+</button></div>
    <button class="primary" id="speak-button" type="button">🔊 Hear the question</button>`;
}

function renderActivityPrompt(title) {
  return `<p class="question">${escapeHtml(activityDescriptions[title] || 'Ready when you are!')}</p>
    <button class="primary" id="speak-button" type="button">🔊 Hear this activity</button>`;
}

function speakCurrent() {
  if (!('speechSynthesis' in window)) return;
  const text = state.activity === 'Alphabets'
    ? `${state.letter}. ${state.letter} is for ${state.letter === 'A' ? 'apple' : state.letter === 'B' ? 'ball' : 'a new word'}.`
    : `${state.activity}. ${activityDescriptions[state.activity] || ''}`;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

async function onLogout() {
  try {
    const result = await requestAuth('logout');
    if (result.status !== 200) {
      window.alert(result.data.error || 'Could not log out. Please try again.');
      return;
    }
  } catch {
    window.alert('Could not connect to log out. Please try again.');
    return;
  }
  state = { screen: 'auth', mode: 'login', user: null, subject: null, activity: null, letter: 'A', number: 2 };
  render();
}

function render() {
  if (state.screen === 'home') renderHome();
  else if (state.screen === 'activities') renderActivities();
  else if (state.screen === 'lesson') renderLesson();
  else renderAuth();
}

async function initialize() {
  try {
    const result = await requestAuth('session');
    if (result.status === 200) {
      state.user = result.data;
      state.screen = 'home';
    }
  } catch {
    state.screen = 'auth';
  }
  render();
}

initialize();
