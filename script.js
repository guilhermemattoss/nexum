import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDSM8zwHfuBQqJI0HdLHKM7CvbnXaaIeEI",
  authDomain: "nexum-bfd4f.firebaseapp.com",
  projectId: "nexum-bfd4f",
  storageBucket: "nexum-bfd4f.firebasestorage.app",
  messagingSenderId: "595290271397",
  appId: "1:595290271397:web:92deb960a61432eb9f674c",
  measurementId: "G-G7V32MMWSK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const mensagem = document.getElementById("mensagem");
const moodsDiv = document.querySelector(".moods");
const authDiv = document.getElementById("auth");
const moods = document.querySelectorAll(".mood");

const clickSound = new Audio("assets/click.mp3");


function mudarTema(mood) {
  switch (mood) {
    case "vazio":
      document.documentElement.style.setProperty("--bg", "#0a0a0a");
      document.documentElement.style.setProperty("--text", "#777777");
      break;
    case "furia":
      document.documentElement.style.setProperty("--bg", "#2b0000");
      document.documentElement.style.setProperty("--text", "#ff4c4c");
      break;
    case "tristeza":
      document.documentElement.style.setProperty("--bg", "#001f3f");
      document.documentElement.style.setProperty("--text", "#a9cce3");
      break;
    case "serenidade":
      document.documentElement.style.setProperty("--bg", "#102020");
      document.documentElement.style.setProperty("--text", "#b0fdfd");
      break;
  }
}

function recomendarMusica(mood) {
  switch (mood) {
    case "vazio":
      return `<a href="https://www.youtube.com/watch?v=4N3N1MlvVc4" target="_blank" rel="noopener noreferrer">🎵 “Mad World” - Gary Jules</a>`;
    case "furia":
      return `<a href="https://www.youtube.com/watch?v=bWXazVhlyxQ" target="_blank" rel="noopener noreferrer">🔥 “Killing in the Name” - Rage Against the Machine</a>`;
    case "tristeza":
      return `<a href="https://www.youtube.com/watch?v=k4V3Mo61fJM" target="_blank" rel="noopener noreferrer">💧 “Fix You” - Coldplay</a>`;
    case "serenidade":
      return `<a href="https://www.youtube.com/watch?v=UfcAVejslrU" target="_blank" rel="noopener noreferrer">🌊 “Weightless” - Marconi Union</a>`;
    default:
      return "Escolha um humor para receber sua trilha sonora!";
  }
}


async function salvarHumorFirebase(humor) {
  const user = auth.currentUser;
  if (!user) {
    alert("Você precisa estar logado para salvar seu humor!");
    return;
  }
  try {
    await setDoc(doc(db, "usuarios", user.uid), {
      humor,
      atualizadoEm: serverTimestamp()
    }, { merge: true });
    console.log(`Humor "${humor}" salvo no Firestore.`);
  } catch (e) {
    console.error("Erro ao salvar humor:", e);
  }
}


async function pegarHumorUsuario() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const docSnap = await getDoc(doc(db, "usuarios", user.uid));
    if (docSnap.exists()) {
      const humorSalvo = docSnap.data().humor;
      mensagem.textContent = `Seu humor salvo: ${humorSalvo}`;
    } else {
      mensagem.textContent = "Nenhum humor salvo ainda.";
    }
  } catch (e) {
    console.error("Erro ao pegar humor:", e);
  }
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    
    authDiv.style.display = "none";
    moodsDiv.style.display = "flex";
    pegarHumorUsuario();
  } else {
    
    authDiv.style.display = "block";
    moodsDiv.style.display = "none";
    mensagem.textContent = "Faça login para salvar seu humor.";
  }
});


btnLogin.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("Erro no login: " + e.message);
  }
});

btnSignup.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Cadastro feito com sucesso! Agora faça login.");
  } catch (e) {
    alert("Erro no cadastro: " + e.message);
  }
});


moods.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    mudarTema(mood);
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Erro ao tocar som:", e));

    mensagem.classList.add("fade");
    setTimeout(() => {
      const recomendacao = recomendarMusica(mood);
      mensagem.innerHTML = `Canal emocional "${mood}" sincronizado. Interface adaptada.<br>${recomendacao}`;

      const style = getComputedStyle(document.documentElement);
      const textColor = style.getPropertyValue("--text");
      mensagem.style.color = textColor;

      mensagem.classList.remove("fade");
    }, 300);

    salvarHumorFirebase(mood);
  });
});
