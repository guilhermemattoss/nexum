const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");
const toggleTema = document.getElementById("toggle-tema");

const clickSound = new Audio("click.mp3");
clickSound.volume = 0.4;

const recomendacoes = {
  feliz: [
    "🎵 Música: Happy - Pharrell",
    "🎬 Filme: Soul",
    "📺 Série: Brooklyn Nine-Nine"
  ],
  triste: [
    "🎵 Música: Someone Like You - Adele",
    "🎬 Filme: As Vantagens de Ser Invisível",
    "📺 Série: This Is Us"
  ],
  calmo: [
    "🎵 Música: Weightless - Marconi Union",
    "🎬 Filme: O Fabuloso Destino de Amélie Poulain",
    "📺 Série: Anne with an E"
  ],
  irritado: [
    "🎵 Música: Numb - Linkin Park",
    "🎬 Filme: Clube da Luta",
    "📺 Série: Breaking Bad"
  ],
  cansado: [
    "🎵 Música: Let Her Go - Passenger",
    "🎬 Filme: Na Natureza Selvagem",
    "📺 Série: Midnight Gospel"
  ],
  apaixonado: [
    "🎵 Música: Perfect - Ed Sheeran",
    "🎬 Filme: La La Land",
    "📺 Série: Modern Love"
  ]
};

function exibirRecomendacoes(mood) {
  const sugestoes = recomendacoes[mood] || [];
  if (sugestoes.length > 0) {
    const aleatorias = [...sugestoes].sort(() => 0.5 - Math.random()).slice(0, 3);
    mensagem.innerHTML = aleatorias.map(s => `<p>${s}</p>`).join("");
  } else {
    mensagem.textContent = "Sem recomendações ainda 😢";
  }
  mensagem.classList.remove("fade-in");
  void mensagem.offsetWidth;
  mensagem.classList.add("fade-in");
  clickSound.currentTime = 0;
  clickSound.play();
  localStorage.setItem("ultimoMood", mood);
}

moods.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    exibirRecomendacoes(mood);
  });
});

function aplicarTema(tema) {
  document.body.classList.toggle("light", tema === "light");
  localStorage.setItem("tema", tema);
}
toggleTema.addEventListener("click", () => {
  const temaAtual = document.body.classList.contains("light") ? "dark" : "light";
  aplicarTema(temaAtual);
});

window.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema");
  if (temaSalvo) aplicarTema(temaSalvo);

  const moodSalvo = localStorage.getItem("ultimoMood");
  if (moodSalvo) exibirRecomendacoes(moodSalvo);
});
