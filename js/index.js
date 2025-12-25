const app = document.getElementById("app");
const themeBtn = document.getElementById("themeBtn");

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

/* REGISTER */
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function checkUser() {
  const user = getUser();
  if (!user) {
    showRegister();
    return null;
  }
  showProfile();
  return user;
}

function showRegister() {
  app.innerHTML = `
    <div class="card">
      <h2>Register</h2>
      <input id="firstName" placeholder="First Name">
      <input id="lastName" placeholder="Last Name">
      <select id="gender">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input id="age" type="number" placeholder="Age">
      <button class="primary" onclick="register()">Continue</button>
    </div>
  `;
}

function register() {
  const fn = document.getElementById("firstName").value.trim();
  const ln = document.getElementById("lastName").value.trim();
  const gender = document.getElementById("gender").value;
  const age = document.getElementById("age").value;
  if (!fn || !ln || !gender || !age) return alert("Fill all fields");
  saveUser({ fn, ln, gender, age });
  window.location.href = "vocabulary.html";
}

/* PROFILE */
function showProfile() {
  const user = getUser();
  app.innerHTML = `
    <div class="card">
      <h2>Profile</h2>
      <p><b>Name:</b> ${user.fn} ${user.ln}</p>
      <p><b>Gender:</b> ${user.gender}</p>
      <p><b>Age:</b> ${user.age}</p>
      <button class="primary" onclick="window.location.href='vocabulary.html'">Go to Vocabulary</button>
    </div>
  `;
}
function playAudio(text) {
  const synth = window.speechSynthesis;

  if (synth.speaking) synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.9;

  // MOBILE FIX
  synth.resume();
  synth.speak(utter);
}

/* INIT */
checkUser();
function playAudio(text) {
  const synth = window.speechSynthesis;

  synth.cancel();

  const speak = () => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    synth.speak(utter);
  };

  // 🔴 MUHIM FIX (Netlify + mobile)
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => {
      synth.resume();
      speak();
    };
  } else {
    synth.resume();
    speak();
  }
}

function openInBrowser() {
  window.open(window.location.href, "_blank");
}
