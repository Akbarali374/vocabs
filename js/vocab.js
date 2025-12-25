const app = document.getElementById("app");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const themeBtn = document.getElementById("themeBtn");

/* MENU */
menuBtn.onclick = () => {
  menu.style.display = menu.style.display === "block" ? "none" : "block";
};

/* DARK MODE */
themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
};
if (localStorage.getItem("theme") === "light")
  document.body.classList.add("light");

/* STORAGE */
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function getWords() {
  return JSON.parse(localStorage.getItem("words")) || [];
}
function saveWords(words) {
  localStorage.setItem("words", JSON.stringify(words));
}

/* PROFILE */
function showProfile() {
  const user = getUser();
  const words = getWords();
  app.innerHTML = `
        <div class="card">
        <h2>Profile</h2>
        <p><b>Name:</b> ${user.fn} ${user.ln}</p>
        <p><b>Gender:</b> ${user.gender}</p>
        <p><b>Age:</b> ${user.age}</p>
        <p><b>Total words:</b> ${words.length}</p>
        </div>
    `;
  menu.style.display = "none";
}

/* VOCABULARY */
function showVocabulary() {
  const words = getWords();
  app.innerHTML = `
        <div class="card">
        <h2>Add new word</h2>
        <input id="en" placeholder="English word">
        <input id="uz" placeholder="Uzbek meaning">
        <input id="pr" placeholder="Pronunciation">
        <button class="primary" onclick="addWord()">Add word</button>
        </div>
        <div class="card">
        <h2>Your words</h2>
        ${words
          .map(
            (w) => `
            <div class="word">
            <b>${w.en}</b> — ${w.uz} <small>${w.pr}</small>
            <button class="audioBtn" onclick="playAudio('${w.en}')">🔊 Listen</button>
            </div>
        `
          )
          .join("")}
        ${
          words.length >= 10
            ? `<button class="primary" onclick="startTest()">Start test</button>`
            : `<p>Add at least 10 words to start test</p>`
        }
        </div>
    `;
  menu.style.display = "none";
}

function addWord() {
  const en = document.getElementById("en").value.trim();
  const uz = document.getElementById("uz").value.trim();
  const pr = document.getElementById("pr").value.trim();
  if (!en || !uz || !pr) return alert("Fill all fields");
  const words = getWords();
  words.push({ id: Date.now(), en, uz, pr });
  saveWords(words);
  showVocabulary();
}

/* AUDIO */
function playAudio(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  window.speechSynthesis.speak(msg);
}

/* TEST */
let testWords = [],
  index = 0,
  score = 0;

function startTest() {
  const words = getWords();
  if (words.length < 10) return alert("Add at least 10 words for test");
  testWords = words.slice(-10);
  index = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (index >= testWords.length) {
    showResult();
    return;
  }
  const current = testWords[index];
  const options = shuffle([
    current.uz,
    ...getWords()
      .filter((w) => w.id !== current.id)
      .slice(0, 3)
      .map((w) => w.uz),
  ]);
  app.innerHTML = `
        <div class="card">
        <h2>Question ${index + 1}/10</h2>
        <h3>${current.en}</h3>
        ${options
          .map(
            (o) =>
              `<label><input type="radio" name="opt" value="${o}"> ${o}</label><br>`
          )
          .join("")}
        <button class="primary" onclick="checkAnswer('${
          current.uz
        }')">Next</button>
        </div>
    `;
}

function checkAnswer(correct) {
  const sel = document.querySelector("input[name='opt']:checked");
  if (!sel) return alert("Choose answer");
  if (sel.value === correct) score++;
  index++;
  showQuestion();
}

function showResult() {
  app.innerHTML = `
        <div class="card">
        <h2>Test Result</h2>
        <p>Correct answers: ${score}/10</p>
        <button class="primary" onclick="showVocabulary()">Back to Vocabulary</button>
        </div>
    `;
}

function shuffle(a) {
  return a.sort(() => Math.random() - 0.5);
}

/* INIT */
const user = getUser();
if (!user) window.location.href = "index.html";
else showVocabulary();

/* VOCABULARY */
function showVocabulary() {
  const words = getWords();
  app.innerHTML = `
        <div class="card">
        <h2>Add new word</h2>
        <input id="en" placeholder="English word">
        <input id="uz" placeholder="Uzbek meaning">
        <input id="pr" placeholder="Pronunciation">
        <button class="primary" onclick="addWord()">Add word</button>
        </div>
        <div class="card">
        <h2>Your words</h2>
        ${words
          .map(
            (w) => `
            <div class="word">
            <b>${w.en}</b> — ${w.uz} <small>${w.pr}</small>
            <button class="audioBtn" onclick="playAudio('${w.en}')">🔊 Listen</button>
            </div>
        `
          )
          .join("")}
        ${
          words.length >= 10
            ? `<button class="primary" onclick="startTest()">Start test</button>`
            : `<p>Add at least 10 words to start test</p>`
        }
        ${
          words.length > 0
            ? `<button class="primary" style="background:red;margin-top:10px;" onclick="clearWords()">Clear All Words</button>`
            : ``
        }
        </div>
    `;
  menu.style.display = "none";
}

/* CLEAR WORDS */
function clearWords() {
  if (confirm("Are you sure you want to delete all words?")) {
    localStorage.removeItem("words");
    showVocabulary();
  }
}
const isTelegram = /Telegram/i.test(navigator.userAgent);

if (isTelegram) {
  alert(
    "🔊 Voice does NOT work in Telegram.\nPlease open in Chrome or Safari."
  );
}
