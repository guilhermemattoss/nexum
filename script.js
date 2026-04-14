import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ================= CONFIG =================
const firebaseConfig = {
    apiKey: "AIzaSyDSM8zwHfuBQqJI0HdLHKM7CvbnXaaIeEI",
    authDomain: "nexum-bfd4f.firebaseapp.com",
    projectId: "nexum-bfd4f",
    storageBucket: "nexum-bfd4f.firebasestorage.app",
    appId: "1:595290271397:web:0c0e860298e712d99f674c",
    messagingSenderId: "595290271397",
}   

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= DOM =================
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");

const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");

const feed = document.getElementById("feed");
const postInput = document.getElementById("postInput");
const imageInput = document.getElementById("imageInput");
const btnPostar = document.getElementById("btnPostar");

const bioInput = document.getElementById("bioInput");
const profileImageInput = document.getElementById("profileImageInput");
const btnSalvarPerfil = document.getElementById("btnSalvarPerfil");

const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");

const clickSound = new Audio("assets/click.mp3");

// ================= CLOUDINARY =================
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "nexum_upload");

  const res = await fetch("https://api.cloudinary.com/v1_1/dxnyjxtbk/image/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  console.log("RESPOSTA CLOUDINARY:", data); // 👈 AQUI

  return data.secure_url;
}
// ================= PERFIL =================
async function atualizarPerfil() {
  const user = auth.currentUser;
  if (!user) return;

  let fotoURL = "";

  if (profileImageInput?.files.length > 0) {
    fotoURL = await uploadImage(profileImageInput.files[0]);
  }

  await setDoc(doc(db, "usuarios", user.uid), {
    bio: bioInput?.value || "",
    fotoURL
  }, { merge: true });
}

btnSalvarPerfil?.addEventListener("click", atualizarPerfil);

// ================= POSTS =================
async function criarPost(texto) {
  const user = auth.currentUser;
  if (!user) return;

  const file = imageInput?.files?.[0]; // 👈 GUARDA AQUI

  console.log("FILE:", file);

  const userDoc = await getDoc(doc(db, "usuarios", user.uid));
  const nome = userDoc.exists() ? userDoc.data().nome : "Anon";

  let imageUrl = "";

  if (file) {
    imageUrl = await uploadImage(file);
    console.log("URL DA IMAGEM:", imageUrl);
  }

  await addDoc(collection(db, "posts"), {
    uid: user.uid,
    nome,
    texto,
    criadoEm: serverTimestamp(),
    likes: [],
    ...(imageUrl && { imageUrl }) // 👈 evita undefined
  });
}

// ================= COMMENTS =================
async function comentar(postId, texto) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "posts", postId, "comments"), {
    uid: user.uid,
    texto,
    criadoEm: serverTimestamp()
  });
}

// ================= FOLLOW =================
async function seguirUsuario(targetUid) {
  const user = auth.currentUser;
  if (!user) return;

  await updateDoc(doc(db, "usuarios", user.uid), {
    seguindo: arrayUnion(targetUid)
  });

  await updateDoc(doc(db, "usuarios", targetUid), {
    seguidores: arrayUnion(user.uid)
  });
}

// ================= FEED =================
async function carregarPosts() {
  const user = auth.currentUser;
  if (!user) return;

  const userSnap = await getDoc(doc(db, "usuarios", user.uid));
  const seguindo = userSnap.exists() ? userSnap.data().seguindo || [] : [];

  // inclui o próprio usuário
  seguindo.push(user.uid);

  const q = query(collection(db, "posts"), orderBy("criadoEm", "desc"));

  onSnapshot(q, async (snapshot) => {
    feed.innerHTML = "";

    for (const docItem of snapshot.docs) {
      const post = docItem.data();

      if (!seguindo.includes(post.uid)) continue;

      const userSnap = await getDoc(doc(db, "usuarios", post.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};

      const div = document.createElement("div");
      div.classList.add("post");

      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${userData.fotoURL || 'default.png'}" width="40" height="40" style="border-radius:50%;">
          <strong>${post.nome}</strong>
        </div>

        <p>${post.texto}</p>

        ${post.imageUrl ? `<img src="${post.imageUrl}" style="max-width:100%; border-radius:10px;">` : ""}

        <button class="likeBtn">❤️ ${post.likes ? post.likes.length : 0}</button>

        <div class="comments"></div>

        <input class="commentInput" placeholder="Comentar...">
        <button class="commentBtn">Enviar</button>

        <button class="followBtn">Seguir</button>
      `;

      // LIKE
      div.querySelector(".likeBtn").addEventListener("click", async () => {
        await updateDoc(doc(db, "posts", docItem.id), {
          likes: arrayUnion(user.uid)
        });
      });

      // COMMENT
      const input = div.querySelector(".commentInput");
      div.querySelector(".commentBtn").addEventListener("click", async () => {
        if (!input.value) return;
        await comentar(docItem.id, input.value);
        input.value = "";
      });

      // FOLLOW
      div.querySelector(".followBtn").addEventListener("click", async () => {
        await seguirUsuario(post.uid);
      });

      // COMMENTS REALTIME
      const commentsDiv = div.querySelector(".comments");

      const commentsQuery = query(collection(db, "posts", docItem.id, "comments"));

      onSnapshot(commentsQuery, (snap) => {
        commentsDiv.innerHTML = "";

        snap.forEach(c => {
          const p = document.createElement("p");
          p.textContent = c.data().texto;
          commentsDiv.appendChild(p);
        });
      });

      feed.appendChild(div);
    }
  });
}

// ================= AUTH =================
btnLogin?.addEventListener("click", async () => {
  await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
});

btnSignup?.addEventListener("click", async () => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  );

  const user = userCredential.user;

  await setDoc(doc(db, "usuarios", user.uid), {
    nome: emailInput.value.split("@")[0],
    email: emailInput.value,
    seguidores: [],
    seguindo: []
  });
});

// ================= POST BUTTON =================
onAuthStateChanged(auth, (user) => {
  if (user) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";

    const btnPostar = document.getElementById("btnPostar");

    btnPostar?.addEventListener("click", async () => {
      console.log("BOTÃO CLICADO");

      const texto = postInput.value;
      if (!texto) return;

      await criarPost(texto);

      postInput.value = "";
      if (imageInput) imageInput.value = "";
    });

    carregarPosts();

  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});
  

// ================= MOODS =================
moods.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;

    clickSound.currentTime = 0;
    clickSound.play();

    mensagem.textContent = `Você está em ${mood}`;
  });
});

