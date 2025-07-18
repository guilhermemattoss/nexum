const clickSound = new Audio("assets/click.mp3");

const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");

moods.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    mudarTema(mood);
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Erro ao tocar som:", e));

    mensagem.classList.add('fade');
    setTimeout(() => {
      const recomendacao = recomendarMusica(mood);
      console.log("Recomendação:", recomendacao);
      mensagem.innerHTML = `Canal emocional "${mood}" sincronizado. Interface adaptada.<br>${recomendacao}`;

      const style = getComputedStyle(document.documentElement);
      const textColor = style.getPropertyValue('--text');
      mensagem.style.color = textColor;

      mensagem.classList.remove('fade');
    }, 300);
  });
});

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
