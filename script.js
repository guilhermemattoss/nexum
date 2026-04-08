import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "nexum-bfd4f.firebaseapp.com",
  projectId: "nexum-bfd4f",
  storageBucket: "nexum-bfd4f.firebasestorage.app",
  messagingSenderId: "595290271397",
  appId: "1:595290271397:web:92deb960a61432eb9f674c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 elementos
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const mensagem = document.getElementById("mensagem");
const moodsDiv = document.querySelector(".moods");
const authDiv = document.getElementById("auth");
const moods = document.querySelectorAll(".mood");

// 🔥 NOVOS
const feed = document.getElementById("feed");
const btnPostar = document.getElementById("btnPostar");
const postInput = document.getElementById("postInput");

const clickSound = new Audio("assets/click.mp3");

// 🎨 tema
function mudarTema(mood) {
  const temas = {
    vazio: ["#0a0a0a", "#777"],
    furia: ["#2b0000", "#ff4c4c"],
    tristeza: ["#001f3f", "#a9cce3"],
    serenidade: ["#102020", "#b0fdfd"]
  };

  if (temas[mood]) {
    document.documentElement.style.setProperty("--bg", temas[mood][0]);
    document.documentElement.style.setProperty("--text", temas[mood][1]);
  }
}

// 🎵 música
function recomendarMusica(mood) {
  const musicas = {
    vazio: "https://www.youtube.com/embed/4N3N1MlvVc4",
    furia: "https://www.youtube.com/embed/bWXazVhlyxQ",
    tristeza: "https://www.youtube.com/embed/k4V3Mo61fJM",
    serenidade: "https://www.youtube.com/embed/UfcAVejslrU"
  };

  if (!musicas[mood]) return "";

  return `
    <iframe width="250" height="80"
    src="${musicas[mood]}"
    frameborder="0" allowfullscreen></iframe>
  `;
}

// 💾 salvar humor
async function salvarHumorFirebase(humor) {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(doc(db, "usuarios", user.uid), {
    humor,
    atualizadoEm: serverTimestamp()
  }, { merge: true });
}

// 👤 pegar humor
async function pegarHumorUsuario() {
  const user = auth.currentUser;
  if (!user) return;

  const docSnap = await getDoc(doc(db, "usuarios", user.uid));

  if (docSnap.exists()) {
    mensagem.textContent = `Seu humor: ${docSnap.data().humor}`;
  }
}

// 🧠 CRIAR POST
async function criarPost(texto) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "posts"), {
    uid: user.uid,
    texto,
    criadoEm: serverTimestamp()
  });
}

// 🔥 CARREGAR FEED
async function carregarPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));

  feed.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const post = doc.data();

    const div = document.createElement("div");
    div.classList.add("post");

    div.innerHTML = `
      <p>${post.texto}</p>
      <small>${post.uid}</small>
    `;

    feed.appendChild(div);
  });
}

// 🔘 postar
btnPostar?.addEventListener("click", async () => {
  const texto = postInput.value;
  if (!texto) return;

  await criarPost(texto);
  postInput.value = "";
  carregarPosts();
});

// 🔐 auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    authDiv.style.display = "none";
    moodsDiv.style.display = "flex";
    pegarHumorUsuario();
    carregarPosts(); // 🔥 AQUI
  } else {
    authDiv.style.display = "block";
    moodsDiv.style.display = "none";
  }
});

// 🔑 login
btnLogin.addEventListener("click", async () => {
  await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
});

// 🆕 cadastro
btnSignup.addEventListener("click", async () => {
  await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
});

// 🎭 moods
moods.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;

    mudarTema(mood);
    clickSound.currentTime = 0;
    clickSound.play();

    mensagem.innerHTML = `
      Você está em <b>${mood}</b><br>
      ${recomendarMusica(mood)}
    `;

    salvarHumorFirebase(mood);
  });
});
