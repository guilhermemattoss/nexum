import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Config Firebase
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

const clickSound = new Audio("assets/click.mp3");
const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");

// Login demo (prompt, pra acelerar)
async function loginDemo(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    mensagem.textContent = `Olá, ${userCredential.user.email}! Escolha seu humor.`;
    pegarHumorUsuario();
  } catch (error) {
    alert("Erro no login: " + error.message);
  }
}

// Salvar humor no Firestore
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

onAuthStateChanged(auth, (user) => 
  if (user) {
    pegarHumorUsuario();
  } else {
    mensagem.textContent = "Faça login para salvar seu humor.";
  }
});


const email = prompt("Digite seu email para login demo:");
const pas
