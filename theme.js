(function () {
  const THEMES = ["dark", "light", "auto"];
  const LABELS = { dark: "● dark", light: "○ light", auto: "◑ auto" };

  function getStored() {
    try {
      return localStorage.getItem("theme") || "auto";
    } catch (_) {
      return "auto";
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }

  function updateButton(theme) {
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = LABELS[theme];
  }

  function toggle() {
    const current = getStored();
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    saveTheme(next);
    // circular reveal from the toggle button via the View Transitions API;
    // plain swap on unsupporting browsers or reduced-motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduced) {
      const btn = document.getElementById("theme-toggle");
      if (btn) {
        const r = btn.getBoundingClientRect();
        const root = document.documentElement;
        root.style.setProperty("--ripple-x", r.left + r.width / 2 + "px");
        root.style.setProperty("--ripple-y", r.top + r.height / 2 + "px");
        root.classList.add("theme-ripple");
      }
      const vt = document.startViewTransition(function () {
        applyTheme(next);
        updateButton(next);
      });
      vt.finished.finally(function () {
        document.documentElement.classList.remove("theme-ripple");
      });
    } else {
      applyTheme(next);
      updateButton(next);
    }
  }

  // Must load synchronously in <head> (no defer/async) — defer breaks flash prevention
  applyTheme(getStored());

  document.addEventListener("DOMContentLoaded", function () {
    updateButton(getStored());
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", toggle);
  });

  window._themeInit = function () {
    updateButton(getStored());
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.removeEventListener("click", toggle);
    btn.addEventListener("click", toggle);
  };
})();
