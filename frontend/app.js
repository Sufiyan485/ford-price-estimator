/**
 * app.js
 * ---------------------------------------------------------------
 * Wires up the form, the segmented transmission control, and the
 * result panel's four states: idle / loading / success / error.
 * ---------------------------------------------------------------
 */

(function () {
  "use strict";

  const form = document.getElementById("predict-form");
  const submitBtn = document.getElementById("submit-btn");
  const modelSelect = document.getElementById("model");
  const transmissionGroup = document.getElementById("transmission-group");
  const transmissionInput = document.getElementById("transmission");

  const stage = document.querySelector(".car-stage");
  const states = {
    idle: document.getElementById("state-idle"),
    loading: document.getElementById("state-loading"),
    success: document.getElementById("state-success"),
    error: document.getElementById("state-error")
  };
  const resultPanel = document.querySelector(".result-panel");
  const progressFill = document.getElementById("progress-fill");
  const loadingMessageEl = document.getElementById("loading-message");
  const resultPriceEl = document.getElementById("result-price");
  const resultChipsEl = document.getElementById("result-chips");
  const errorMessageEl = document.getElementById("error-message");
  const resetBtn = document.getElementById("reset-btn");
  const retryBtn = document.getElementById("retry-btn");

  let lastPayload = null;
  let loadingMessageTimer = null;
  let progressTimer = null;

  const LOADING_MESSAGES = [
    "Checking under the hood…",
    "Comparing similar listings…",
    "Factoring in the mileage…",
    "Weighing engine size and trim…",
    "Tuning the estimate…",
    "Nearly there…"
  ];

  /* -----------------------------------------------------------
     Populate the model dropdown from the shared source of truth
     ----------------------------------------------------------- */
  FORD_MODELS.forEach((model) => {
    const opt = document.createElement("option");
    opt.value = model;
    opt.textContent = model;
    modelSelect.appendChild(opt);
  });

  /* -----------------------------------------------------------
     Segmented transmission control
     ----------------------------------------------------------- */
  transmissionGroup.querySelectorAll(".segmented-option").forEach((btn) => {
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    btn.addEventListener("click", () => {
      transmissionGroup.querySelectorAll(".segmented-option").forEach((b) => b.setAttribute("aria-checked", "false"));
      btn.setAttribute("aria-checked", "true");
      transmissionInput.value = btn.dataset.value;
      transmissionInput.dispatchEvent(new Event("change"));
    });
  });

  /* -----------------------------------------------------------
     State switching
     ----------------------------------------------------------- */
  function showState(name) {
    Object.entries(states).forEach(([key, el]) => {
      el.hidden = key !== name;
    });
    stage.classList.toggle("is-loading", name === "loading");
    stage.classList.toggle("is-success", name === "success");
  }

  function startLoadingAnimation() {
    let messageIndex = 0;
    loadingMessageEl.textContent = LOADING_MESSAGES[0];
    loadingMessageTimer = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      loadingMessageEl.style.opacity = 0;
      setTimeout(() => {
        loadingMessageEl.textContent = LOADING_MESSAGES[messageIndex];
        loadingMessageEl.style.opacity = 1;
      }, 200);
    }, 2600);

    // Asymptotic progress: fast at first, then creeps toward 92%
    // so a slow cold-start backend never looks stalled or "done".
    let progress = 0;
    progressFill.style.width = "0%";
    progressTimer = setInterval(() => {
      const remaining = 92 - progress;
      progress += remaining * 0.06;
      progressFill.style.width = `${progress}%`;
    }, 200);
  }

  function stopLoadingAnimation() {
    clearInterval(loadingMessageTimer);
    clearInterval(progressTimer);
    loadingMessageTimer = null;
    progressTimer = null;
  }

  /* -----------------------------------------------------------
     Formatting helpers
     ----------------------------------------------------------- */
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  function animateCountUp(target) {
    const duration = 700;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      resultPriceEl.textContent = priceFormatter.format(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderChips(payload) {
    const chips = [
      `${payload.year}`,
      payload.transmission,
      payload.fuelType,
      `${payload.mileage.toLocaleString()} mi`
    ];
    resultChipsEl.innerHTML = "";
    chips.forEach((label) => {
      const li = document.createElement("li");
      li.textContent = label;
      resultChipsEl.appendChild(li);
    });
  }

  /* -----------------------------------------------------------
     Form submission
     ----------------------------------------------------------- */
  function buildPayload() {
    const fd = new FormData(form);
    return {
      model: fd.get("model"),
      year: Number(fd.get("year")),
      transmission: fd.get("transmission"),
      mileage: Number(fd.get("mileage")),
      fuelType: fd.get("fuelType"),
      tax: Number(fd.get("tax")),
      mpg: Number(fd.get("mpg")),
      engineSize: Number(fd.get("engineSize"))
    };
  }

  const MIN_LOADING_DURATION = 2000; // ms — ensures the wheel animation is always noticeable,
                                      // even when the backend responds almost instantly

  async function runPrediction(payload) {
    submitBtn.disabled = true;
    showState("loading");
    startLoadingAnimation();
    const loadingStartedAt = performance.now();

    try {
      const price = await fetchPredictedPrice(payload);
      const elapsed = performance.now() - loadingStartedAt;
      if (elapsed < MIN_LOADING_DURATION) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_DURATION - elapsed));
      }
      stopLoadingAnimation();
      progressFill.style.width = "100%";
      renderChips(payload);
      showState("success");
      animateCountUp(price);
    } catch (err) {
      stopLoadingAnimation();
      errorMessageEl.textContent = err.message || "Something went wrong. Please try again.";
      showState("error");
    } finally {
      submitBtn.disabled = false;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity() || !transmissionInput.value) {
      form.reportValidity();
      if (!transmissionInput.value) {
        transmissionGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    lastPayload = buildPayload();
    runPrediction(lastPayload);
  });

  resetBtn.addEventListener("click", () => {
    showState("idle");
  });

  retryBtn.addEventListener("click", () => {
    if (lastPayload) runPrediction(lastPayload);
  });
})();