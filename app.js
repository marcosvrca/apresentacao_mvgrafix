(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.getElementById("progress");
  const counter = document.getElementById("counter");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const total = slides.length;
  let index = 0;

  function go(to) {
    const next = Math.max(0, Math.min(total - 1, to));
    if (next === index && slides[index].classList.contains("is-active")) {
      updateChrome();
      return;
    }
    slides[index]?.classList.remove("is-active");
    index = next;
    slides[index].classList.add("is-active");
    updateChrome();
    history.replaceState(null, "", `#${index + 1}`);
  }

  function updateChrome() {
    const pct = ((index + 1) / total) * 100;
    progress.style.width = `${pct}%`;
    counter.textContent = `${index + 1} / ${total}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
  }

  function fromHash() {
    const n = parseInt(location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n) && n >= 1 && n <= total) return n - 1;
    return 0;
  }

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
    } else if (e.key === "f" || e.key === "F") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  });

  let touchX = null;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  window.addEventListener(
    "touchend",
    (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].screenX - touchX;
      touchX = null;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) go(index + 1);
      else go(index - 1);
    },
    { passive: true }
  );

  index = fromHash();
  slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
  updateChrome();
})();
