const generateBtn = document.getElementById("generateBtn");
const heroIntro = document.getElementById("heroIntro");
const reportCard = document.getElementById("reportCard");

if (generateBtn && heroIntro && reportCard) {
  generateBtn.addEventListener("click", () => {
    heroIntro.classList.add("hidden");
    reportCard.classList.remove("hidden");
  });
}
