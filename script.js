const somClique = new Audio('click.mp3');

const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");

const recomendacoes = {
  vazio: {
    musica: "Breathe Me - Sia",
    filme: "Ela (Her)",
    jogo: "Inside",
    serie: "Maniac (Netflix)"
  },
  furia: {
    musica: "Killing in the Name - Rage Against the Machine",
    filme: "Clube da Luta",
    jogo: "DOOM Eternal",
    serie: "Vikings"
  },
  tristeza: {
    musica: "Fix You - Coldplay",
    filme: "As Vantagens de Ser Invisível",
    jogo: "Life is Strange",
    serie: "BoJack Horseman"
  },
  serenidade: {
    musica: "Weightless - Marconi Union",
    filme: "A Vida Secreta de Walter Mitty",
    jogo: "Journey",
    serie: "Anne with an E"
  }
};

moods.forEach(btn => {
  btn.addEventListener("click", () => {
    somClique.currentTime = 0;
    somClique.play();

    const mood = btn.dataset.mood;
    mudarTema(mood);

    mensagem.innerHTML = `<p>Canal emocional "<strong>${mood}</strong>" sincronizado.<br>Interface adaptada.</p>`;

    const r = recomendacoes[mood];
    const bloco = `
      <div class="card">
        <p><strong>Música:</strong> ${r.musica}</p>
        <p><strong>Filme:</strong> ${r.filme}</p>
        <p><strong>Jogo:</strong> ${r.jogo}</p>
        <p><strong>Série:</strong> ${r.serie}</p>
      </div>
    `;

    mensagem.innerHTML += bloco;
    mensagem.style.opacity = 0;
    setTimeout(() => {
      mensagem.style.opacity = 1;
    }, 100);
  });
});

function mudarTema(mood) {
  switch (mood) {
    case "vazio":
      document.documentElement.style.setProperty("--bg", "#0a0a0a");
      document.documentElement.style.setProperty("--text", "#777");
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
