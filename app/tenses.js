(function () {
  const TENSES = {
    present: {
      icon: "🌞", title: "Present Tense",
      intro: "The present tense tells what happens now, what happens again and again, or what is always true.",
      kids: ["I jump.", "I run.", "The cat sleeps.", "The bird sings.", "Mom cooks rice.", "I am eating.", "The baby is laughing.", "Dad is driving a car.", "I have a toy.", "The sun is hot."],
      forms: [
        { name: "Simple Present", formula: "subject + verb (add s/es for he, she, it)", use: "Habits, daily routines and facts.", examples: ["I eat breakfast every day.", "She plays in the park.", "The sun rises in the east."] },
        { name: "Present Continuous", formula: "subject + am/is/are + verb-ing", use: "Something happening right now.", examples: ["I am drawing a picture.", "He is running in the field.", "They are singing a song."] },
        { name: "Present Perfect", formula: "subject + has/have + past participle", use: "Something that has just finished or happened already.", examples: ["I have finished my homework.", "She has written a letter.", "We have already eaten."] },
        { name: "Present Perfect Continuous", formula: "subject + has/have been + verb-ing", use: "Something that started in the past and is still going on.", examples: ["I have been reading for an hour.", "It has been raining all day.", "They have been playing since morning."] }
      ]
    },
    past: {
      icon: "⏪", title: "Past Tense",
      intro: "The past tense tells what already happened before now.",
      kids: ["I jumped.", "The cat slept.", "I ate an apple.", "Mom cooked rice.", "The bird sang a song.", "I saw a big dog.", "We played yesterday.", "I was happy.", "The baby cried.", "Dad drove the car."],
      forms: [
        { name: "Simple Past", formula: "subject + verb in past form (played, went)", use: "Something that finished in the past.", examples: ["I played cricket yesterday.", "She went to school.", "We saw a rainbow."] },
        { name: "Past Continuous", formula: "subject + was/were + verb-ing", use: "Something that was going on at a time in the past.", examples: ["I was sleeping at 9 o'clock.", "They were playing outside.", "She was reading a book."] },
        { name: "Past Perfect", formula: "subject + had + past participle", use: "Something that happened before another thing in the past.", examples: ["I had finished before you came.", "She had eaten before dinner.", "The train had left when we arrived."] },
        { name: "Past Perfect Continuous", formula: "subject + had been + verb-ing", use: "Something that was going on for some time before another past event.", examples: ["I had been waiting for an hour.", "It had been raining before we left.", "They had been playing all day."] }
      ]
    },
    future: {
      icon: "🚀", title: "Future Tense",
      intro: "The future tense tells what will happen later, after now.",
      kids: ["I will jump.", "I will eat a cake.", "The cat will sleep.", "We will play tomorrow.", "Mom will cook rice.", "The bird will sing.", "I will go to school.", "It will rain soon.", "I will be a doctor.", "Dad will buy a toy."],
      forms: [
        { name: "Simple Future", formula: "subject + will + base verb", use: "Something that will happen later.", examples: ["I will visit my grandma tomorrow.", "She will play football.", "We will eat ice cream."] },
        { name: "Future Continuous", formula: "subject + will be + verb-ing", use: "Something that will be going on at a time in the future.", examples: ["I will be sleeping at 10 o'clock.", "They will be travelling tomorrow.", "She will be singing on stage."] },
        { name: "Future Perfect", formula: "subject + will have + past participle", use: "Something that will be finished by a time in the future.", examples: ["I will have finished by Friday.", "She will have written the letter.", "We will have eaten by then."] },
        { name: "Future Perfect Continuous", formula: "subject + will have been + verb-ing", use: "Something that will have been going on for some time by a future time.", examples: ["I will have been studying for two hours.", "They will have been playing since morning.", "She will have been walking for an hour."] }
      ]
    }
  };

  const BASIC = {
    intro: "A tense is the form of a verb that tells us WHEN something happens. It tells us if an action happens now, already happened, or will happen later.",
    types: [
      { key: "present", text: "Present tense: happening now or happening regularly. Example: I eat an apple." },
      { key: "past", text: "Past tense: already happened. Example: I ate an apple." },
      { key: "future", text: "Future tense: will happen later. Example: I will eat an apple." }
    ],
    note: "Each tense has four forms: Simple, Continuous, Perfect and Perfect Continuous."
  };

  const SUBJECTS = [
    { t: "I", be: "am", was: "was", have: "have", third: false },
    { t: "You", be: "are", was: "were", have: "have", third: false },
    { t: "He", be: "is", was: "was", have: "has", third: true },
    { t: "She", be: "is", was: "was", have: "has", third: true },
    { t: "We", be: "are", was: "were", have: "have", third: false },
    { t: "They", be: "are", was: "were", have: "have", third: false },
    { t: "The dog", be: "is", was: "was", have: "has", third: true },
    { t: "My friends", be: "are", was: "were", have: "have", third: false },
    { t: "The children", be: "are", was: "were", have: "have", third: false },
    { t: "Ravi", be: "is", was: "was", have: "has", third: true }
  ];
  // base, third person, past, past participle, -ing, rest of sentence
  const VERBS = [
    ["play", "plays", "played", "played", "playing", "in the park"],
    ["eat", "eats", "ate", "eaten", "eating", "an apple"],
    ["go", "goes", "went", "gone", "going", "to school"],
    ["write", "writes", "wrote", "written", "writing", "a letter"],
    ["run", "runs", "ran", "run", "running", "in the field"],
    ["see", "sees", "saw", "seen", "seeing", "a rainbow"],
    ["drink", "drinks", "drank", "drunk", "drinking", "some milk"],
    ["sing", "sings", "sang", "sung", "singing", "a song"],
    ["swim", "swims", "swam", "swum", "swimming", "in the river"],
    ["paint", "paints", "painted", "painted", "painting", "a picture"],
    ["watch", "watches", "watched", "watched", "watching", "a movie"],
    ["help", "helps", "helped", "helped", "helping", "mother"],
    ["read", "reads", "read", "read", "reading", "a storybook"],
    ["take", "takes", "took", "taken", "taking", "a photo"],
    ["clean", "cleans", "cleaned", "cleaned", "cleaning", "the room"],
    ["jump", "jumps", "jumped", "jumped", "jumping", "on the bed"],
    ["sleep", "sleeps", "slept", "slept", "sleeping", "on the bed"],
    ["cook", "cooks", "cooked", "cooked", "cooking", "rice"],
    ["laugh", "laughs", "laughed", "laughed", "laughing", "loudly"]
  ];
  const KINDS = {
    present: [
      { id: "Simple Present", hint: "every day", make: (s, v) => (s.third ? v[1] : v[0]) },
      { id: "Present Continuous", hint: "right now", make: (s, v) => `${s.be} ${v[4]}` },
      { id: "Present Perfect", hint: "already", make: (s, v) => `${s.have} ${v[3]}` }
    ],
    past: [
      { id: "Simple Past", hint: "yesterday", make: (s, v) => v[2] },
      { id: "Past Continuous", hint: "at 5 o'clock yesterday", make: (s, v) => `${s.was} ${v[4]}` },
      { id: "Past Perfect", hint: "before dinner", make: (s, v) => `had ${v[3]}` }
    ],
    future: [
      { id: "Simple Future", hint: "tomorrow", make: (s, v) => `will ${v[0]}` },
      { id: "Future Continuous", hint: "at this time tomorrow", make: (s, v) => `will be ${v[4]}` },
      { id: "Future Perfect", hint: "by next Friday", make: (s, v) => `will have ${v[3]}` }
    ]
  };
  const ALL_KINDS = [...KINDS.present, ...KINDS.past, ...KINDS.future];

  const pick = list => list[Math.floor(Math.random() * list.length)];
  const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = text => text.toLowerCase().replace(/\s+/g, " ").trim();
  const cap = text => text.charAt(0).toUpperCase() + text.slice(1);

  let lastKey = "";
  function makeQuestion(tense) {
    let s, v, kind, key;
    do {
      s = pick(SUBJECTS); v = pick(VERBS); kind = pick(KINDS[tense]);
      key = [s.t, v[0], kind.id].join("|");
    } while (key === lastKey);
    lastKey = key;
    const answer = kind.make(s, v);
    const text = `${s.t} ___ (${v[0]}) ${v[5]} ${kind.hint}.`;
    const pool = new Set();
    ALL_KINDS.forEach(k => pool.add(k.make(s, v)));
    pool.add(s.third ? v[0] : v[1]);
    pool.delete(answer);
    const near = shuffle([...pool]).slice(0, 3);
    return { text, answer, kind: kind.id, options: shuffle([answer, ...near]) };
  }

  const state = { tense: "present", mode: "options", question: null, score: 0, total: 0, streak: 0, answered: false };
  const root = () => document.getElementById("tenses");

  function speak(text) {
    if (typeof say === "function") say([text]);
  }
  function show(html) {
    root().innerHTML = html;
    root().scrollTop = 0;
  }
  function back(action, label) {
    return `<button class="english-back" type="button" data-tn="${action}">← ${label || "Back"}</button>`;
  }
  function hear(text) {
    return `<button class="english-hear" type="button" data-tn="hear" data-text="${text.replace(/"/g, "&quot;")}">🔊 Hear this</button>`;
  }

  function showMenu() {
    hideScreens();
    root().hidden = false;
    show(`${back("exit")}<div class="big" aria-hidden="true">⏰</div><h1>Tenses</h1><p>Learn when things happen!</p>
<div class="english-type-options tenses-options">
<button class="choice-card english-type-card" type="button" data-tn="basic"><span class="choice-icon" aria-hidden="true">💡</span><span class="choice-label">What are tenses?<small>Basic information and types</small></span></button>
<button class="choice-card english-type-card" type="button" data-tn="tense" data-tense="present"><span class="choice-icon" aria-hidden="true">🌞</span><span class="choice-label">Present Tense<small>Now and every day</small></span></button>
<button class="choice-card english-type-card" type="button" data-tn="tense" data-tense="past"><span class="choice-icon" aria-hidden="true">⏪</span><span class="choice-label">Past Tense<small>Things that already happened</small></span></button>
<button class="choice-card english-type-card" type="button" data-tn="tense" data-tense="future"><span class="choice-icon" aria-hidden="true">🚀</span><span class="choice-label">Future Tense<small>Things that will happen</small></span></button>
</div>`);
    speak("Tenses. Choose basic information, present tense, past tense, or future tense.");
  }

  function showBasic() {
    const spoken = [BASIC.intro, ...BASIC.types.map(t => t.text), BASIC.note].join(" ");
    show(`${back("menu", "Tenses")}<h1>What are tenses?</h1>${hear(spoken)}
<div class="tenses-card"><p>${BASIC.intro}</p></div>
<div class="tenses-card"><h2>Types of tenses</h2><ul>${BASIC.types.map(t => `<li>${t.text}</li>`).join("")}</ul></div>
<div class="tenses-card"><p>${BASIC.note}</p></div>`);
    speak(spoken);
  }

  function showTense(key) {
    state.tense = key;
    const t = TENSES[key];
    show(`${back("menu", "Tenses")}<div class="big" aria-hidden="true">${t.icon}</div><h1>${t.title}</h1><p>${t.intro}</p>
<div class="english-type-options tenses-options">
<button class="choice-card english-type-card" type="button" data-tn="detail"><span class="choice-icon" aria-hidden="true">📘</span><span class="choice-label">Detailed information<small>Forms, uses and examples</small></span></button>
<button class="choice-card english-type-card" type="button" data-tn="quiz"><span class="choice-icon" aria-hidden="true">📝</span><span class="choice-label">Start quiz<small>Never-ending practice</small></span></button>
</div>`);
    speak(`${t.title}. ${t.intro}`);
  }

  function showDetail() {
    const t = TENSES[state.tense];
    const spoken = [t.intro, "Easy examples.", ...t.kids, ...t.forms.map(f => `${f.name}. ${f.use} Formula: ${f.formula}. For example: ${f.examples.join(" ")}`)].join(" ");
    show(`${back("tense", t.title)}<h1>${t.title}</h1>${hear(spoken)}
<div class="tenses-card"><p>${t.intro}</p></div>
<div class="tenses-card"><h2>⭐ Easy examples for kids</h2><ul>${t.kids.map(e => `<li>${e}</li>`).join("")}</ul></div>
${t.forms.map(f => `<div class="tenses-card"><h2>${f.name}</h2><p><strong>Formula:</strong> ${f.formula}</p><p><strong>Use:</strong> ${f.use}</p><p><strong>Examples:</strong></p><ul>${f.examples.map(e => `<li>${e}</li>`).join("")}</ul></div>`).join("")}`);
    speak(spoken);
  }

  function showQuiz(reset) {
    if (reset) { state.score = 0; state.total = 0; state.streak = 0; }
    state.question = makeQuestion(state.tense);
    state.answered = false;
    const q = state.question, t = TENSES[state.tense], withOptions = state.mode === "options";
    show(`${back("tense", t.title)}<h1>${t.title} Quiz</h1>
<div class="tenses-modes" role="group" aria-label="Quiz type">
<button type="button" class="tenses-mode${withOptions ? " active" : ""}" data-tn="mode" data-mode="options">With options</button>
<button type="button" class="tenses-mode${withOptions ? "" : " active"}" data-tn="mode" data-mode="type">Without options</button></div>
<p class="tenses-score" aria-live="polite">⭐ Score: ${state.score}/${state.total} &nbsp; 🔥 Streak: ${state.streak}</p>
<div class="tenses-card tenses-question"><p>Fill in the blank with the correct form of the verb.</p><h2 id="tn-q">${q.text}</h2>
${withOptions
  ? `<div class="tenses-answers">${q.options.map(o => `<button type="button" class="tenses-answer" data-tn="pick" data-value="${o}">${o}</button>`).join("")}</div>`
  : `<form id="tn-form" class="tenses-form"><input id="tn-input" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Type your answer" aria-label="Your answer"><button type="submit" class="tenses-answer">Check</button></form>`}
<p id="tn-feedback" class="tenses-feedback" aria-live="polite"></p>
<button type="button" id="tn-next" class="tenses-answer tenses-next" data-tn="next" hidden>Next question ➜</button></div>`);
    const form = document.getElementById("tn-form");
    if (form) form.onsubmit = event => { event.preventDefault(); check(document.getElementById("tn-input").value); };
    speak(q.text.replace("___", "blank"));
  }

  function check(value) {
    if (state.answered || !norm(value)) return;
    state.answered = true;
    const q = state.question, ok = norm(value) === norm(q.answer);
    state.total++;
    if (ok) { state.score++; state.streak++; } else state.streak = 0;
    const fb = document.getElementById("tn-feedback");
    fb.className = `tenses-feedback ${ok ? "good" : "bad"}`;
    fb.textContent = ok ? `✅ Correct! The answer is "${q.answer}". (${q.kind})` : `❌ Not quite. The answer is "${q.answer}". (${q.kind})`;
    root().querySelectorAll(".tenses-answer[data-value]").forEach(b => {
      b.disabled = true;
      if (norm(b.dataset.value) === norm(q.answer)) b.classList.add("right");
      else if (norm(b.dataset.value) === norm(value)) b.classList.add("wrong");
    });
    const input = document.getElementById("tn-input");
    if (input) { input.disabled = true; root().querySelector("#tn-form button").disabled = true; }
    root().querySelector(".tenses-score").innerHTML = `⭐ Score: ${state.score}/${state.total} &nbsp; 🔥 Streak: ${state.streak}`;
    document.getElementById("tn-next").hidden = false;
    speak(ok ? "Correct! Well done." : `The correct answer is ${q.answer}.`);
  }

  function init() {
    const entry = document.getElementById("english-tenses-entry");
    if (!entry) return;
    entry.onclick = showMenu;
    root().addEventListener("click", event => {
      const el = event.target.closest("[data-tn]");
      if (!el) return;
      switch (el.dataset.tn) {
        case "exit": stopSpeech(); showEnglishTypes(); break;
        case "menu": showMenu(); break;
        case "basic": showBasic(); break;
        case "tense": showTense(el.dataset.tense || state.tense); break;
        case "detail": showDetail(); break;
        case "quiz": showQuiz(true); break;
        case "mode": state.mode = el.dataset.mode; showQuiz(false); break;
        case "pick": check(el.dataset.value); break;
        case "next": showQuiz(false); break;
        case "hear": speak(el.dataset.text); break;
      }
    });
  }
  init();
})();
