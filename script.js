const clickSound = new Audio("assets/click.mp3");

const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");

moods.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    mudarTema(mood);
    clickSound.play();

    mensagem.classList.add('fade');
    setTimeout(() => {
      mensagem.textContent = `Canal emocional "${mood}" sincronizado. Interface adaptada.\n🎵 Recomendação: ${recomendarMusica(mood)}`;

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
      return "“Mad World” - Gary Jules";
    case "furia":
      return "“Killing in the Name” - Rage Against the Machine";
    case "tristeza":
      return "“Fix You” - Coldplay";
    case "serenidade":
      return "“Weightless” - Marconi Union";
    default:
      return "Escolha um humor para receber sua trilha sonora!";
  }
}
