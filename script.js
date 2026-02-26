const generateBtn = document.getElementById("generateBtn");
const hero = document.getElementById("hero");
const heroIntro = document.getElementById("heroIntro");
const reportCard = document.getElementById("reportCard");

if (generateBtn && hero && heroIntro && reportCard) {
  generateBtn.addEventListener("click", () => {
    heroIntro.classList.add("hidden");
    reportCard.classList.remove("hidden");
    hero.classList.add("report-mode");
  });
}
