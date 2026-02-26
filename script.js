const generateBtn = document.getElementById("generateBtn");
const hero = document.getElementById("hero");
const heroIntro = document.getElementById("heroIntro");
const reportCard = document.getElementById("reportCard");
const sendSlackBtn = document.getElementById("sendSlackBtn");
const slackModalOverlay = document.getElementById("slackModalOverlay");
const slackNoBtn = document.getElementById("slackNoBtn");
const slackYesBtn = document.getElementById("slackYesBtn");

if (generateBtn && hero && heroIntro && reportCard) {
  generateBtn.addEventListener("click", () => {
    heroIntro.classList.add("hidden");
    reportCard.classList.remove("hidden");
    hero.classList.add("report-mode");
  });
}

if (sendSlackBtn && slackModalOverlay && slackNoBtn && slackYesBtn) {
  sendSlackBtn.addEventListener("click", () => {
    slackModalOverlay.classList.remove("hidden");
  });

  slackNoBtn.addEventListener("click", () => {
    slackModalOverlay.classList.add("hidden");
  });

  slackYesBtn.addEventListener("click", () => {
    slackModalOverlay.classList.add("hidden");
    alert("Report sent to Slack.");
  });

  slackModalOverlay.addEventListener("click", (event) => {
    if (event.target === slackModalOverlay) {
      slackModalOverlay.classList.add("hidden");
    }
  });
}
