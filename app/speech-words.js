(function () {
  const GROUPS = [
    { key: "sounds", icon: "🔊", title: "Sounds & Exclamations", tip: "Fun sounds are easy to copy and make speaking exciting.", words: [["Moo", "🐄"], ["Beep", "🚗"], ["Uh-oh!", "😮"], ["Yay!", "🎉"], ["Woof", "🐶"], ["Meow", "🐱"], ["Choo choo", "🚂"], ["Wow!", "🤩"], ["Quack", "🦆"], ["Baa", "🐑"], ["Roar", "🦁"], ["Buzz", "🐝"], ["Splash!", "💦"], ["Boom!", "💥"], ["Tick tock", "⏰"], ["Hello!", "👋"]] },
    { key: "actions", icon: "🏃", title: "Action Words", tip: "Say the word right as you do the action.", words: [["Go", "🚦"], ["Up", "🎈"], ["Eat", "🍎"], ["Stop", "✋"], ["Sit", "🪑"], ["Jump", "🦘"], ["Clap", "👏"], ["Drink", "🥛"], ["Run", "🏃"], ["Walk", "🚶"], ["Come", "🤗"], ["Look", "👀"], ["Sleep", "😴"], ["Wash", "🧼"], ["Throw", "🏐"], ["Hug", "🫂"]] },
    { key: "requests", icon: "🙋", title: "Request Words", tip: "These words help children ask for what they need.", words: [["More", "🍪"], ["Help", "🆘"], ["Mine", "🧸"], ["Open", "📦"], ["Please", "🙏"], ["Water", "💧"], ["Milk", "🥛"], ["All done", "✅"], ["Again", "🔁"], ["Up please", "🙋"], ["Hungry", "🍽️"], ["Sorry", "😔"], ["Thank you", "💐"], ["My turn", "👉"], ["Play", "🧩"]] }
  ];
  const METHODS = [
    { icon: "🎬", title: "Visual Short Videos", intro: "A picture plus one word plus a happy voice.", talk: [["Parent", "Look! A big shiny balloon!", "🎈"], ["Parent", "Up! Up! Up!", "⬆️"], ["Child", "Uh!", "👶"], ["Parent", "Yes! Up! Say it with me, up!", "😊"], ["Child", "Up!", "👶"], ["Parent", "Yay! The balloon goes up!", "🎉"]] },
    { icon: "⚽", title: "Action Pairing", intro: "Say the word just before you do the action.", talk: [["Parent", "Ready? Go!", "🚗"], ["Parent", "The car goes! Go, go, go!", "💨"], ["Child", "Go!", "👶"], ["Parent", "Great talking! Stop! The car stops.", "✋"], ["Child", "Stop!", "👶"], ["Parent", "Yay! Again? Go!", "🎉"]] },
    { icon: "🍎", title: "The Choice Game", intro: "Hold up two things and wait for the child to try.", talk: [["Parent", "Do you want the apple or the block?", "🍎"], ["Parent", "Apple? Or block?", "🧱"], ["Child", "Ap!", "👶"], ["Parent", "Apple! Yes, you asked for the apple. Here you go!", "🥰"], ["Child", "Apple!", "👶"], ["Parent", "Wonderful talking!", "🌟"]] },
    { icon: "📚", title: "Picture Books", intro: "Point to a simple picture and say its name happily.", talk: [["Parent", "Look at this! A dog!", "🐶"], ["Parent", "The dog says woof, woof!", "🔊"], ["Child", "Woof!", "👶"], ["Parent", "Yes! Woof! Now, where is the cat?", "🐱"], ["Child", "Meow!", "👶"], ["Parent", "You found the cat! Well done!", "👏"]] }
  ];
  const PARTS = [
    ["banana", "🍌", ["ba", "na", "na"]], ["apple", "🍎", ["ap", "ple"]], ["mango", "🥭", ["man", "go"]], ["tiger", "🐯", ["ti", "ger"]],
    ["rabbit", "🐰", ["rab", "bit"]], ["monkey", "🐵", ["mon", "key"]], ["butterfly", "🦋", ["but", "ter", "fly"]], ["elephant", "🐘", ["el", "e", "phant"]],
    ["umbrella", "☂️", ["um", "brel", "la"]], ["tomato", "🍅", ["to", "ma", "to"]], ["potato", "🥔", ["po", "ta", "to"]], ["pencil", "✏️", ["pen", "cil"]],
    ["flower", "🌸", ["flow", "er"]], ["balloon", "🎈", ["bal", "loon"]], ["chocolate", "🍫", ["choc", "o", "late"]], ["computer", "💻", ["com", "pu", "ter"]],
    ["dinosaur", "🦖", ["di", "no", "saur"]], ["pizza", "🍕", ["piz", "za"]], ["window", "🪟", ["win", "dow"]], ["giraffe", "🦒", ["gi", "raffe"]]
  ];
  const root = () => document.getElementById("speech-words");
  const speak = (text, rate) => { if (typeof say === "function") say([rate ? { text, lang: "en-IN", rate, pitch: 1.08 } : text]); };
  const show = html => { root().innerHTML = html; root().scrollTop = 0; };
  const back = (a, l) => `<button class="english-back" type="button" data-sw="${a}">← ${l || "Back"}</button>`;
  const shuffle = l => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const intro = "Teaching kids speech words works best through playful repetition, striking visuals, and connecting words to what they are doing right now. Start with useful words and fun sounds that give them a sense of control when they speak.";

  function menu() {
    hideScreens();
    root().hidden = false;
    show(`${back("exit")}<div class="big" aria-hidden="true">🗣️</div><h1>Learn to Speak Words</h1>
<div class="tenses-card"><p>${intro}</p></div>
<div class="english-type-options tenses-options">
${GROUPS.map(g => `<button class="choice-card english-type-card" type="button" data-sw="group" data-key="${g.key}"><span class="choice-icon" aria-hidden="true">${g.icon}</span><span class="choice-label">${g.title}<small>${g.words.slice(0, 4).map(w => w[0]).join(" · ")}</small></span></button>`).join("")}
<button class="choice-card english-type-card" type="button" data-sw="parts"><span class="choice-icon" aria-hidden="true">🧩</span><span class="choice-label">Build Words from Sounds<small>ba + na + na = banana</small></span></button>
<button class="choice-card english-type-card" type="button" data-sw="methods"><span class="choice-icon" aria-hidden="true">💡</span><span class="choice-label">Creative Learning Methods<small>Videos, actions, choices, books</small></span></button>
<button class="choice-card english-type-card" type="button" data-sw="game"><span class="choice-icon" aria-hidden="true">🎮</span><span class="choice-label">Choice Game<small>Pick, listen and say the word</small></span></button>
</div>`);
    speak("Learn to speak words. Choose sounds, action words, request words, creative methods, or the choice game.", .76);
  }

  function group(key) {
    const g = GROUPS.find(x => x.key === key);
    show(`${back("menu", "Speech words")}<h1>${g.icon} ${g.title}</h1><p>${g.tip}</p><p class="tenses-score">Tap a picture. Listen. Then say it out loud!</p>
<div class="speech-grid">${g.words.map(w => `<button type="button" class="speech-word" data-sw="word" data-word="${w[0]}"><span class="speech-emoji" aria-hidden="true">${w[1]}</span><strong>${w[0]}</strong></button>`).join("")}</div>`);
    speak(`${g.title}. ${g.tip} Tap a picture and say it out loud.`, .76);
  }

  function parts() {
    show(`${back("menu", "Speech words")}<h1>🧩 Build Words from Sounds</h1>
<div class="tenses-card"><p>Long words are easier when we say them in small parts. Say each part slowly, then put the parts together!</p><p class="speech-formula">🍌 banana = <b>ba</b> + <b>na</b> + <b>na</b></p></div>
<p class="tenses-score">Tap a card to hear the parts, then the whole word.</p>
<div class="speech-parts">${PARTS.map((w, i) => `<button type="button" class="speech-part-card" data-sw="part" data-i="${i}"><span class="speech-emoji" aria-hidden="true">${w[1]}</span><span class="speech-chips">${w[2].map(s => `<b>${s}</b>`).join(" + ")}</span><strong>= ${w[0]}</strong></button>`).join("")}</div>`);
    speak("Build words from sounds. Say each small part, then put them together. For example, ba, na, na, banana.", .76);
  }

  const playTalk = m => say(m.talk.map(([who, line]) => who === "Child" ? { text: line, lang: "en-IN", rate: .7, pitch: 1.35, pauseAfter: 700 } : { text: line, lang: "en-IN", rate: .74, pitch: 1.05, pauseAfter: 600 }));
  function methods() {
    show(`${back("menu", "Speech words")}<h1>💡 Creative Learning Methods</h1><p class="tenses-score">Read each little conversation. Tap ▶ to hear it!</p>
${METHODS.map((m, i) => `<div class="tenses-card"><h2>${m.icon} ${m.title}</h2><p>${m.intro}</p>
<div class="talk">${m.talk.map(([who, line, em]) => `<div class="talk-row ${who === "Child" ? "child" : "parent"}"><span class="talk-face" aria-hidden="true">${em}</span><div class="talk-bubble"><small>${who === "Child" ? "Child" : "Parent"}</small>${line}</div></div>`).join("")}</div>
<button type="button" class="english-hear" data-sw="talk" data-i="${i}">▶ Hear the conversation</button></div>`).join("")}
<div class="tenses-card"><h2>🎈 Try it: the word “Up”</h2><button type="button" class="speech-word speech-up" data-sw="word" data-word="Up"><span class="speech-emoji speech-float" aria-hidden="true">🎈</span><strong>Up!</strong></button></div>`);
    speak("Creative learning methods. Read each little conversation, and tap play to hear it.", .76);
  }
  let gameScore = 0;
  function game() {
    const pool = GROUPS.flatMap(g => g.words);
    const [a, b] = shuffle(pool).slice(0, 2);
    show(`${back("menu", "Speech words")}<h1>🎮 Choice Game</h1><p class="tenses-score">⭐ Words tried: ${gameScore}</p>
<div class="talk"><div class="talk-row parent"><span class="talk-face" aria-hidden="true">🧑</span><div class="talk-bubble"><small>Parent</small>Do you want the ${a[0].toLowerCase()} or the ${b[0].toLowerCase()}? Tap the one you want and say its word!</div></div></div>
<div class="speech-grid">${[a, b].map(w => `<button type="button" class="speech-word" data-sw="choose" data-word="${w[0]}"><span class="speech-emoji" aria-hidden="true">${w[1]}</span></button>`).join("")}</div>
<p id="sw-msg" class="tenses-feedback good" aria-live="polite"></p>
<button type="button" class="tenses-answer tenses-next" data-sw="game" hidden id="sw-next">Play again ➜</button>`);
    say([{ text: `Do you want ${a[0]}, or ${b[0]}?`, lang: "en-IN", rate: .72, pitch: 1.05 }]);
  }

  function init() {
    const entry = document.getElementById("english-speech-entry");
    if (!entry) return;
    entry.onclick = menu;
    root().addEventListener("click", event => {
      const el = event.target.closest("[data-sw]");
      if (!el) return;
      switch (el.dataset.sw) {
        case "exit": stopSpeech(); showEnglishTypes(); break;
        case "menu": menu(); break;
        case "group": group(el.dataset.key); break;
        case "methods": methods(); break;
        case "parts": parts(); break;
        case "part": {
          const w = PARTS[+el.dataset.i];
          el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
          say([...w[2].map(s => ({ text: s, lang: "en-IN", rate: .55, pitch: 1.1, pauseAfter: 500 })), { text: w[0], lang: "en-IN", rate: .6, pitch: 1.1, pauseAfter: 700 }, { text: w[0], lang: "en-IN", rate: .7, pitch: 1.1 }]);
          break;
        }
        case "game": game(); break;
        case "hear": speak(el.dataset.text, .76); break;
        case "talk": playTalk(METHODS[+el.dataset.i]); break;
        case "word":
          el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
          if (typeof say === "function") say([{ text: el.dataset.word, lang: "en-IN", rate: .6, pitch: 1.1, pauseAfter: 900 }, { text: el.dataset.word, lang: "en-IN", rate: .6, pitch: 1.1 }]);
          break;
        case "choose":
          gameScore++;
          root().querySelectorAll(".speech-word").forEach(b => b.disabled = true);
          el.classList.add("pop");
          document.getElementById("sw-msg").textContent = `Parent: "You want ${el.dataset.word}! Say ${el.dataset.word}!"  Child: "${el.dataset.word}!"  Parent: "Yay, well done!"`;
          document.getElementById("sw-next").hidden = false;
          say([{ text: `Say ${el.dataset.word}!`, lang: "en-IN", rate: .7, pitch: 1.1, pauseAfter: 900 }, { text: el.dataset.word, lang: "en-IN", rate: .6, pitch: 1.1, pauseAfter: 900 }, { text: "Yay! Well done!", lang: "en-IN", rate: .76, pitch: 1.15 }]);
          break;
      }
    });
  }
  init();
})();
