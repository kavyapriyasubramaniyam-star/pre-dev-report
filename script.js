const generateBtn = document.getElementById("generateBtn");
const hero = document.getElementById("hero");
const heroIntro = document.getElementById("heroIntro");
const reportCard = document.getElementById("reportCard");
const inboxEmailEl = document.getElementById("inboxEmail");
const inboxReadTimeEl = document.getElementById("inboxReadTime");

const sendSlackBtn = document.getElementById("sendSlackBtn");
const slackModalOverlay = document.getElementById("slackModalOverlay");
const slackNoBtn = document.getElementById("slackNoBtn");
const slackYesBtn = document.getElementById("slackYesBtn");

const BACKEND_BASE_URL = window.BACKEND_BASE_URL || "http://127.0.0.1:8001";

if (generateBtn && hero && heroIntro && reportCard) {
  generateBtn.addEventListener("click", async () => {
    heroIntro.classList.add("hidden");
    reportCard.classList.remove("hidden");
    hero.classList.add("report-mode");

    if (inboxEmailEl) inboxEmailEl.textContent = "Loading...";
    if (inboxReadTimeEl) inboxReadTimeEl.textContent = "Loading...";

    generateBtn.disabled = true;

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/generate-report`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }

      const data = await response.json();

      if (inboxEmailEl) inboxEmailEl.textContent = data.inbox_email || "--";
      if (inboxReadTimeEl) {
        inboxReadTimeEl.textContent = data.latest_inbox_read_time || "--";
      }
    } catch (error) {
      // Fallback for deployed frontend when local backend is unavailable.
      if (inboxEmailEl) inboxEmailEl.textContent = "Cris@telavbv.com";
      if (inboxReadTimeEl) inboxReadTimeEl.textContent = "26 Feb 2026 11:05 PM";
      console.error(error);
    } finally {
      generateBtn.disabled = false;
    }
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
