(function () {
  const BASIC = [
    "A phrase is a small group of words that go together and give an idea. A phrase is not a full sentence because it does not tell a complete story by itself.",
    "A sentence has a subject and a verb. A phrase does not. For example, 'in the garden' is a phrase. 'The cat sleeps in the garden' is a sentence."
  ];
  const TYPES = [
    { name: "Noun phrase", icon: "🐶", text: "A noun phrase names a person, animal, place or thing, with words that describe it.", examples: ["a big brown dog", "my little sister", "the red balloon", "a bowl of rice"] },
    { name: "Verb phrase", icon: "🏃", text: "A verb phrase shows an action, using more than one word.", examples: ["is running", "will play", "has finished", "can swim"] },
    { name: "Adjective phrase", icon: "🌈", text: "An adjective phrase describes a person or thing.", examples: ["very tall", "full of water", "as soft as cotton", "so happy"] },
    { name: "Adverb phrase", icon: "🐢", text: "An adverb phrase tells how, when or where something happens.", examples: ["very slowly", "every morning", "with a smile", "in a hurry"] },
    { name: "Prepositional phrase", icon: "📍", text: "A prepositional phrase starts with a word like in, on, under or with, and tells where or when.", examples: ["under the table", "on the roof", "in the morning", "with my friends"] }
  ];
  const COMMON = [
    ["a piece of cake", "something very easy", "Maths homework was a piece of cake for me."],
    ["under the weather", "feeling a little sick", "I am under the weather today, so I will rest."],
    ["break a leg", "good luck", "Break a leg in your dance show!"],
    ["hit the books", "study hard", "I will hit the books tonight for my test."],
    ["once in a blue moon", "very rarely", "We eat ice cream once in a blue moon."],
    ["the early bird catches the worm", "people who start early get the best things", "Wake up early. The early bird catches the worm."],
    ["let the cat out of the bag", "tell a secret by mistake", "Ravi let the cat out of the bag about the surprise party."],
    ["a blessing in disguise", "something good that first looks bad", "Missing the bus was a blessing in disguise."],
    ["cost an arm and a leg", "be very expensive", "That toy car costs an arm and a leg."],
    ["in the same boat", "in the same situation as others", "We are all in the same boat. We all have homework."],
    ["raining cats and dogs", "raining very heavily", "Take an umbrella. It is raining cats and dogs!"],
    ["over the moon", "very, very happy", "She was over the moon after winning the prize."],
    ["bite off more than you can chew", "try to do too much", "Do not bite off more than you can chew."],
    ["a little bird told me", "I heard it from someone secret", "A little bird told me it is your birthday."],
    ["keep an eye on", "watch carefully", "Please keep an eye on the baby."],
    ["good morning", "a greeting we say in the morning", "Good morning, teacher!"],
    ["thank you very much", "a polite way to show we are grateful", "Thank you very much for the gift."],
    ["how are you", "a polite way to ask about someone", "Hello! How are you today?"],
    ["take care", "stay safe and well", "Bye, take care!"],
    ["well done", "you did a good job", "Well done, you won the race!"]
  ];
  const TYPE_BANK = TYPES.flatMap(t => t.examples.map(e => [e, t.name]));
  const TYPE_NAMES = TYPES.map(t => t.name);
  const COMPLETE = [
    ["a piece of ___", "cake"], ["under the ___", "weather"], ["raining cats and ___", "dogs"],
    ["the early ___ catches the worm", "bird"], ["over the ___", "moon"], ["once in a blue ___", "moon"],
    ["good ___", "morning"], ["thank ___ very much", "you"], ["well ___", "done"], ["take ___", "care"],
    ["hit the ___", "books"], ["break a ___", "leg"], ["keep an ___ on", "eye"], ["in the same ___", "boat"]
  ];
  const COMPLETE_WRONG = ["cake", "dogs", "moon", "bird", "books", "leg", "eye", "boat", "sun", "star", "tree", "fish", "rain", "hand", "sky", "bag", "you", "me", "done", "care", "weather", "morning", "night"];

  const W = {
    adj: ["big", "small", "red", "happy", "tall", "soft", "shiny", "brown", "tiny", "old", "funny", "sweet", "green", "fluffy", "brave", "yellow"],
    noun: ["dog", "cat", "ball", "bird", "flower", "kite", "car", "tree", "house", "balloon", "fish", "cake", "book", "boy", "girl", "teacher"],
    prep: ["under", "on", "in", "behind", "near", "beside", "above", "inside"],
    place: ["the table", "the bed", "the box", "the garden", "the school", "the river", "the chair", "the roof", "the bag", "the tree"],
    when: ["every morning", "every day", "at night", "after lunch", "before dinner", "on Sunday", "in the evening", "at five o'clock"],
    how: ["very slowly", "with a smile", "in a hurry", "very loudly", "with care", "very quickly", "happily", "very softly"],
    verbAux: ["is", "will", "can", "has", "was"], verbMain: ["running", "play", "finished", "sleeping", "eat", "jumped", "singing", "swim"],
    subj: ["The dog", "My mother", "The little bird", "Ravi", "The children", "A girl", "Our teacher", "The cat"],
    act: ["sleeps", "plays", "runs", "sings", "jumps", "reads", "waits", "smiles"]
  };
  const gen = {
    nounPhrase: () => `${pick(["a", "the", "my"])} ${pick(W.adj)} ${pick(W.noun)}`,
    prepPhrase: () => `${pick(W.prep)} ${pick(W.place)}`,
    advPhrase: () => pick([...W.how, ...W.when]),
    adjPhrase: () => `${pick(["very", "so", "extremely", "quite"])} ${pick(["tall", "happy", "soft", "sweet", "brave", "funny", "tiny", "shiny"])}`,
    verbPhrase: () => { const a = pick(["is", "was", "will be", "can", "has been", "will"]); const v = a.endsWith("be") || ["is", "was", "has been"].includes(a) ? pick(["running", "sleeping", "singing", "playing", "eating"]) : pick(["run", "sleep", "sing", "play", "eat"]); return `${a} ${v}`; },
    sentence: () => `${pick(W.subj)} ${pick(W.act)} ${pick(W.prep)} ${pick(W.place)}.`
  };
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const root = () => document.getElementById("phrases");
  const state = { score: 0, total: 0, streak: 0, q: null, answered: false, last: "" };

  const speak = text => { if (typeof say === "function") say([text]); };
  const show = html => { root().innerHTML = html; root().scrollTop = 0; };
  const back = (action, label) => `<button class="english-back" type="button" data-ph="${action}">← ${label || "Back"}</button>`;
  const hear = text => `<button class="english-hear" type="button" data-ph="hear" data-text="${text.replace(/"/g, "&quot;")}">🔊 Hear this</button>`;

  function menu() {
    hideScreens();
    root().hidden = false;
    show(`${back("exit")}<div class="big" aria-hidden="true">💬</div><h1>Phrases</h1><p>Words that work together!</p>
<div class="english-type-options tenses-options">
<button class="choice-card english-type-card" type="button" data-ph="learn"><span class="choice-icon" aria-hidden="true">📘</span><span class="choice-label">Knowledge on Phrases<small>What phrases are, with examples</small></span></button>
<button class="choice-card english-type-card" type="button" data-ph="quiz"><span class="choice-icon" aria-hidden="true">📝</span><span class="choice-label">Quiz questions<small>Never-ending practice</small></span></button>
</div>`);
    speak("Phrases. Choose knowledge on phrases, or quiz questions.");
  }

  function learn() {
    const spoken = [...BASIC, ...TYPES.map(t => `${t.name}. ${t.text} Examples: ${t.examples.join(", ")}.`), "Now some common phrases we use every day.", ...COMMON.map(c => `${c[0]}. It means ${c[1]}. For example: ${c[2]}`)].join(" ");
    show(`${back("menu", "Phrases")}<h1>Knowledge on Phrases</h1>${hear(spoken)}
<div class="tenses-card"><h2>What is a phrase?</h2>${BASIC.map(b => `<p>${b}</p>`).join("")}</div>
<div class="tenses-card"><h2>Phrase or sentence?</h2><ul><li>🌳 "under the tree" is a <strong>phrase</strong>.</li><li>🌳 "The dog sleeps under the tree." is a <strong>sentence</strong>.</li><li>🎈 "a red balloon" is a <strong>phrase</strong>.</li><li>🎈 "I have a red balloon." is a <strong>sentence</strong>.</li></ul></div>
<h2 class="phrases-heading">Types of phrases</h2>
${TYPES.map(t => `<div class="tenses-card"><h2>${t.icon} ${t.name}</h2><p>${t.text}</p><ul>${t.examples.map(e => `<li>${e}</li>`).join("")}</ul></div>`).join("")}
<h2 class="phrases-heading">Common phrases we use</h2>
${COMMON.map(c => `<div class="tenses-card"><h2>"${c[0]}"</h2><p><strong>Meaning:</strong> ${c[1]}.</p><p><strong>Example:</strong> ${c[2]}</p></div>`).join("")}`);
    speak(BASIC.join(" "));
  }

  function makeQuestion() {
    let q, guard = 0;
    do {
      const kind = pick(["meaning", "type", "complete", "genType", "genType", "isPhrase", "isPhrase", "partOf", "pickPhrase"]);
      if (kind === "meaning") {
        const c = pick(COMMON), wrong = shuffle(COMMON.filter(x => x !== c)).slice(0, 3).map(x => x[1]);
        q = { text: `What does "${c[0]}" mean?`, answer: c[1], options: shuffle([c[1], ...wrong]), why: c[2] };
      } else if (kind === "type") {
        const [p, type] = pick(TYPE_BANK);
        q = { text: `What type of phrase is "${p}"?`, answer: type, options: shuffle(TYPE_NAMES).slice(0, 4).includes(type) ? shuffle(TYPE_NAMES).filter(n => n !== type).slice(0, 3).concat(type) : TYPE_NAMES, why: "" };
        q.options = shuffle([type, ...shuffle(TYPE_NAMES.filter(n => n !== type)).slice(0, 3)]);
      } else if (kind === "genType") {
        const map = { "Noun phrase": gen.nounPhrase, "Verb phrase": gen.verbPhrase, "Adjective phrase": gen.adjPhrase, "Adverb phrase": gen.advPhrase, "Prepositional phrase": gen.prepPhrase };
        const type = pick(TYPE_NAMES), ph = map[type]();
        q = { text: `What type of phrase is "${ph}"?`, answer: type, options: shuffle([type, ...shuffle(TYPE_NAMES.filter(n => n !== type)).slice(0, 3)]), why: "" };
      } else if (kind === "isPhrase") {
        const s = gen.sentence(), ph = pick([gen.nounPhrase, gen.prepPhrase, gen.advPhrase])(), item = pick([s, ph]);
        q = { text: `Is "${item}" a phrase or a sentence?`, answer: item === s ? "Sentence" : "Phrase", options: ["Phrase", "Sentence"], why: item === s ? "It has a subject and a verb." : "It is a group of words without a subject and verb." };
      } else if (kind === "partOf") {
        const adj = pick(W.adj), noun = pick(W.noun), ph = `a ${adj} ${noun}`;
        q = { text: `In the phrase "${ph}", which word is the naming word (noun)?`, answer: noun, options: shuffle([noun, adj, "a", pick(W.place).replace("the ", "")]), why: "" };
      } else if (kind === "pickPhrase") {
        const s = gen.sentence(), parts = s.slice(0, -1).split(" "), correct = parts.slice(-3).join(" ");
        const wrong = [parts.slice(0, 2).join(" "), `${gen.nounPhrase()} ${pick(W.act)}`, pick(W.act)].filter(w => w !== correct);
        q = { text: `Find the place phrase in: "${s}"`, answer: correct, options: shuffle([correct, ...wrong.slice(0, 3)]), why: "" };
      } else {
        const [t, a] = pick(COMPLETE), wrong = shuffle(COMPLETE_WRONG.filter(w => w !== a)).slice(0, 3);
        q = { text: `Fill in the blank: ${t}`, answer: a, options: shuffle([a, ...wrong]), why: t.replace("___", a) };
      }
    } while (q.text === state.last && ++guard < 10);
    q.options = [...new Set(q.options)];
    state.last = q.text;
    return q;
  }

  function quiz(reset) {
    if (reset) { state.score = 0; state.total = 0; state.streak = 0; }
    state.q = makeQuestion();
    state.answered = false;
    const q = state.q;
    show(`${back("menu", "Phrases")}<h1>Phrases Quiz</h1>
<p class="tenses-score" aria-live="polite">⭐ Score: ${state.score}/${state.total} &nbsp; 🔥 Streak: ${state.streak}</p>
<div class="tenses-card tenses-question"><h2>${q.text}</h2>
<div class="tenses-answers phrases-answers">${q.options.map(o => `<button type="button" class="tenses-answer" data-ph="pick" data-value="${o.replace(/"/g, "&quot;")}">${o}</button>`).join("")}</div>
<p id="ph-feedback" class="tenses-feedback" aria-live="polite"></p>
<button type="button" class="tenses-answer tenses-next" data-ph="next" hidden>Next question ➜</button></div>`);
    speak(q.text.replace("___", "blank"));
  }

  function check(value) {
    if (state.answered) return;
    state.answered = true;
    const q = state.q, ok = value === q.answer;
    state.total++;
    if (ok) { state.score++; state.streak++; } else state.streak = 0;
    root().querySelectorAll(".tenses-answer[data-value]").forEach(b => {
      b.disabled = true;
      if (b.dataset.value === q.answer) b.classList.add("right");
      else if (b.dataset.value === value) b.classList.add("wrong");
    });
    const fb = document.getElementById("ph-feedback");
    fb.className = `tenses-feedback ${ok ? "good" : "bad"}`;
    fb.textContent = `${ok ? "✅ Correct!" : "❌ Not quite."} The answer is "${q.answer}".${q.why ? " " + q.why : ""}`;
    root().querySelector(".tenses-score").innerHTML = `⭐ Score: ${state.score}/${state.total} &nbsp; 🔥 Streak: ${state.streak}`;
    root().querySelector(".tenses-next").hidden = false;
    speak(ok ? "Correct! Well done." : `The correct answer is ${q.answer}.`);
  }

  function init() {
    const entry = document.getElementById("english-phrases-entry");
    if (!entry) return;
    entry.onclick = menu;
    root().addEventListener("click", event => {
      const el = event.target.closest("[data-ph]");
      if (!el) return;
      switch (el.dataset.ph) {
        case "exit": stopSpeech(); showEnglishTypes(); break;
        case "menu": menu(); break;
        case "learn": learn(); break;
        case "quiz": quiz(true); break;
        case "pick": check(el.dataset.value); break;
        case "next": quiz(false); break;
        case "hear": speak(el.dataset.text); break;
      }
    });
  }
  init();
})();
