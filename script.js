const mensagem = document.getElementById("mensagem");
const moods = document.querySelectorAll(".mood");

// Criar objeto de áudio para o som de clique
const somClique = new Audio('assets/click.mp3');

moods.forEach(btn => {
  btn.addEventListener("click.mp3", () => {
    somClique.play(); // toca o som no clique
    const mood = btn.dataset.mood;
    mudarTema(mood);
    mensagem.textContent = `Canal emocional "${mood}" sincronizado. Interface adaptada.`;
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
