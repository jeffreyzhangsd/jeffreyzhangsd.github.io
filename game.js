(function () {
  "use strict";

  /* ---- Console easter egg --------------------------------------- */
  console.log(
    "%c hey, what are you looking for?! \uD83D\uDE28",
    "background:#0d0d0d;color:#d8d8d8;font-family:monospace;font-size:13px;padding:6px 12px;border:1px solid #555;",
  );

  /* ---- Constants ------------------------------------------------ */
  var STORAGE_KEY = "jz_game";
  var TICK_MS = 1000;
  var LAUNCH_EVERY_N_TICKS = 9;
  var FLIGHT_MS = 5000;

  var UPGRADES = [
    {
      id: "moonbase-1",
      threshold: 5,
      type: "moonbase",
      label: "\u2726 moon base established",
    },
    {
      id: "leetcode",
      threshold: 12,
      type: "handle",
      label: "\u2726 leetcode unlocked",
    },
    {
      id: "moonbase-2",
      threshold: 20,
      type: "moonbase",
      label: "\u2726 moon base expanded",
    },
    {
      id: "twitter",
      threshold: 30,
      type: "handle",
      label: "\u2726 twitter unlocked",
    },
    {
      id: "moonbase-3",
      threshold: 45,
      type: "moonbase",
      label: "\u2726 moon base completed",
    },
    {
      id: "riot games username",
      threshold: 60,
      type: "handle",
      label: "\u2726 riot games user unlocked",
      btnText: "unlock riot\ngames username",
    },
    {
      id: "disco",
      threshold: 100,
      type: "disco",
      label:
        "\u2726 surprise unlocked!\n(volume alert \u2014 slider bottom right)",
    },
    {
      id: "discord",
      threshold: 200,
      type: "handle",
      label: "\u2726 discord unlocked",
      btnText: "wow really\nstill here?\nhere's my discord\nI guess",
    },
  ];

  /* ---- Handle data (kept in JS, never in HTML) ------------------ */
  function d(s) {
    return s
      .split("")
      .map(function (c) {
        return String.fromCharCode(c.charCodeAt(0) ^ 37);
      })
      .join("");
  }

  var HANDLE_DATA = {
    leetcode: {
      label: "LeetCode",
      href: d(
        "\x4d\x51\x51\x55\x56\x1f\x0a\x0a\x49\x40\x40\x51\x46\x4a\x41\x40\x0b\x46\x4a\x48\x0a\x51\x40\x41\x41\x5c\x47\x40\x44\x57\x4a\x5d",
      ),
      text: d(
        "\x49\x40\x40\x51\x46\x4a\x41\x40\x0b\x46\x4a\x48\x0a\x51\x40\x41\x41\x5c\x47\x40\x44\x57\x4a\x5d",
      ),
    },
    twitter: {
      label: "Twitter / X",
      href: d(
        "\x4d\x51\x51\x55\x56\x1f\x0a\x0a\x5d\x0b\x46\x4a\x48\x0a\x51\x40\x41\x41\x5c\x47\x40\x44\x57\x4a\x5d",
      ),
      text: d(
        "\x51\x52\x4c\x51\x51\x40\x57\x0b\x46\x4a\x48\x0a\x51\x40\x41\x41\x5c\x47\x40\x44\x57\x4a\x5d",
      ),
    },
    "riot games username": {
      label: "Riot / op.gg",
      href: d(
        "\x4d\x51\x51\x55\x56\x1f\x0a\x0a\x52\x52\x52\x0b\x4a\x55\x0b\x42\x42\x0a\x56\x50\x48\x48\x4a\x4b\x40\x57\x56\x0a\x4b\x44\x0a\x51\x40\x41\x41\x5c\x47\x40\x44\x57\x4a\x5d\x08\x5c\x4a\x56\x40\x4c",
      ),
      text: d(
        "\x4a\x55\x0b\x42\x42\x0a\x56\x50\x48\x48\x4a\x4b\x40\x57\x56\x0a\x4b\x44\x0a\x51\x40\x41\x41\x5c\x47\x40\x44\x57\x4a\x5d\x08\x5c\x4a\x56\x40\x4c",
      ),
    },
    discord: {
      label: "Discord",
      text: "add me on discord \u00b7 " + d("\x6f\x40\x43"),
    },
  };

  /* ---- ASCII art ------------------------------------------------ */
  var EARTH_ASCII = [
    "  .-----.",
    " / ~. .~ \\",
    "| . ~.~ . |",
    "| ~. . .~ |",
    " \\ .~. . /",
    "  '-----'",
  ].join("\n");

  var LAUNCHPAD_ASCII = " ^ \n/|\\";

  var MOON_STAGES = [
    "(        )\n(            )\n(              )\n(            )\n(        )",
    "|\n(        )\n(            )\n(              )\n(            )\n(        )",
    "|\n(        )\n( [o______o] )\n(              )\n(            )\n(        )",
    "|\n(        )\n( [o______o] )\n(  [========]  )\n( |________| )\n(        )",
  ];

  /* ---- Disco colors --------------------------------------------- */
  var DISCO_COLORS = [
    "#ff0080",
    "#ff6600",
    "#ffcc00",
    "#00ff88",
    "#00ccff",
    "#9933ff",
    "#ff33cc",
  ];
  var DISCO_BG = [
    "#1a0010",
    "#1a0800",
    "#0d1a00",
    "#001a0d",
    "#00101a",
    "#0d001a",
    "#1a0014",
  ];

  /* ---- Disco audio ---------------------------------------------- */
  var DISCO_AUDIO_SRC = "/static/media/showtime.mp3";
  var DISCO_VOLUME_KEY = "game-disco-volume";
  var discoAudio = null;
  var discoVolume = (function () {
    try {
      var raw = localStorage.getItem(DISCO_VOLUME_KEY);
      var v = raw === null ? 0.5 : parseFloat(raw);
      return isNaN(v) ? 0.5 : Math.max(0, Math.min(1, v));
    } catch (_) {
      return 0.5;
    }
  })();

  // Lazy-init: only construct Audio when first needed so the mp3 doesn't load
  // until the user actually triggers disco. Squared mapping for perceived loudness.
  function getDiscoAudio() {
    if (!discoAudio) {
      discoAudio = new Audio(DISCO_AUDIO_SRC);
      discoAudio.loop = true;
      discoAudio.preload = "auto";
    }
    discoAudio.volume = discoVolume * discoVolume;
    return discoAudio;
  }

  /* ---- State ---------------------------------------------------- */
  function defaultState() {
    return { astronauts: 0, unlockedUpgrades: [] };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultState();
    } catch (e) {
      return defaultState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  /* ---- DOM injection ------------------------------------------- */
  function makeEl(tag, id, text) {
    var el = document.createElement(tag);
    if (id) el.id = id;
    if (text) el.textContent = text;
    return el;
  }

  function injectGameLayer() {
    var layer = makeEl("div", "game-layer");

    var earth = makeEl("div", "game-earth");
    var launchpad = makeEl("pre", "game-launchpad", LAUNCHPAD_ASCII);
    var earthAscii = makeEl("pre", "game-earth-ascii", EARTH_ASCII);
    earth.appendChild(launchpad);
    earth.appendChild(earthAscii);

    var moon = makeEl("div", "game-moon");
    var moonAscii = makeEl("pre", "game-moon-ascii");
    var moonCounter = makeEl("div", "game-moon-counter");
    var upgradeBtn = makeEl("button", "game-upgrade-btn");
    var notif = makeEl("div", "game-notif");
    moon.appendChild(moonAscii);
    moon.appendChild(moonCounter);
    moon.appendChild(upgradeBtn);
    moon.appendChild(notif);

    var discoBtn = makeEl("button", "game-disco-btn", "start disco");
    var discoVol = makeEl("input", "game-disco-volume");
    discoVol.type = "range";
    discoVol.min = "0";
    discoVol.max = "1";
    discoVol.step = "0.01";
    discoVol.value = String(discoVolume);
    discoVol.setAttribute("aria-label", "disco volume");
    discoVol.addEventListener("input", function (e) {
      var v = parseFloat(e.target.value);
      if (isNaN(v)) return;
      discoVolume = Math.max(0, Math.min(1, v));
      try {
        localStorage.setItem(DISCO_VOLUME_KEY, String(discoVolume));
      } catch (_) {}
      if (discoAudio) discoAudio.volume = discoVolume * discoVolume;
    });
    var resetBtn = makeEl("button", "game-reset-btn", "reset game");

    layer.appendChild(earth);
    layer.appendChild(moon);
    layer.appendChild(discoBtn);
    layer.appendChild(discoVol);
    layer.appendChild(resetBtn);
    document.body.appendChild(layer);
  }

  /* ---- Moon display -------------------------------------------- */
  function getMoonStage(state) {
    var u = state.unlockedUpgrades;
    if (u.indexOf("moonbase-3") !== -1) return 3;
    if (u.indexOf("moonbase-2") !== -1) return 2;
    if (u.indexOf("moonbase-1") !== -1) return 1;
    return 0;
  }

  function updateMoonDisplay(state) {
    var moonAscii = document.getElementById("game-moon-ascii");
    var moonCounter = document.getElementById("game-moon-counter");
    if (!moonAscii || !moonCounter) return;
    moonAscii.textContent = MOON_STAGES[getMoonStage(state)];
    var n = state.astronauts;
    moonCounter.textContent =
      n === 0
        ? ""
        : "\u00b7 " + n + " astronaut" + (n === 1 ? "" : "s") + " \u00b7";
  }

  /* ---- Notification -------------------------------------------- */
  var notifTimeout = null;

  function showNotification(text) {
    var el = document.getElementById("game-notif");
    if (!el) return;
    if (notifTimeout) clearTimeout(notifTimeout);
    el.textContent = text;
    el.style.opacity = "1";
    notifTimeout = setTimeout(function () {
      el.style.opacity = "0";
    }, 2300);
  }

  /* ---- Disco ---------------------------------------------------- */
  var discoActive = false;
  var discoInterval = null;
  var discoTick = 0;
  var discoEls = null;

  var DISCO_GAME_IDS = [
    "game-earth-ascii",
    "game-launchpad",
    "game-moon-ascii",
    "game-moon-counter",
  ];

  function refreshDiscoCache() {
    var container = document.querySelector(".container");
    discoEls = container
      ? Array.prototype.slice.call(container.querySelectorAll("*"))
      : [];
  }

  function applyDisco() {
    discoTick++;
    var n = DISCO_COLORS.length;
    document.body.style.backgroundColor = DISCO_BG[discoTick % DISCO_BG.length];
    for (var i = 0; i < DISCO_GAME_IDS.length; i++) {
      var el = document.getElementById(DISCO_GAME_IDS[i]);
      if (el) el.style.color = DISCO_COLORS[(discoTick + i) % n];
    }
    for (var j = 0; j < discoEls.length; j++) {
      discoEls[j].style.color = DISCO_COLORS[(discoTick + j + 3) % n];
    }
  }

  function startDisco() {
    if (discoActive) return;
    discoActive = true;
    refreshDiscoCache();
    var discoBtn = document.getElementById("game-disco-btn");
    if (discoBtn) {
      discoBtn.textContent = "stop disco";
      discoBtn.style.color = "#d8d8d8";
    }
    var resetBtn = document.getElementById("game-reset-btn");
    if (resetBtn) resetBtn.style.color = "#d8d8d8";
    discoInterval = setInterval(applyDisco, 500);
    // Music — autoplay may be blocked until user gesture; the disco button click
    // IS that gesture, so this should succeed when user clicks. .catch() swallows
    // the rare blocked case so we don't break disco visuals.
    var audio = getDiscoAudio();
    audio.currentTime = 0;
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  function stopDisco() {
    if (!discoActive) return;
    discoActive = false;
    clearInterval(discoInterval);
    discoInterval = null;
    document.body.style.backgroundColor = "";
    for (var i = 0; i < DISCO_GAME_IDS.length; i++) {
      var el = document.getElementById(DISCO_GAME_IDS[i]);
      if (el) el.style.color = "";
    }
    for (var j = 0; j < discoEls.length; j++) {
      discoEls[j].style.color = "";
    }
    discoEls = null;
    var discoBtn = document.getElementById("game-disco-btn");
    if (discoBtn) {
      discoBtn.textContent = "start disco";
      discoBtn.style.color = "";
    }
    var resetBtn = document.getElementById("game-reset-btn");
    if (resetBtn) resetBtn.style.color = "";
    if (discoAudio) {
      discoAudio.pause();
      discoAudio.currentTime = 0;
    }
  }

  /* ---- Unlocks -------------------------------------------------- */
  function applyUnlocks(state) {
    var container = document.getElementById("contact-unlocks");
    if (!container) return;
    for (var i = 0; i < state.unlockedUpgrades.length; i++) {
      var id = state.unlockedUpgrades[i];
      var data = HANDLE_DATA[id];
      if (!data) continue;
      var elId = "handle-" + id.replace(/\s+/g, "-");
      if (document.getElementById(elId)) continue;
      var item = makeEl("div", elId);
      item.className = "contact-item";
      var labelEl = document.createElement("div");
      labelEl.className = "section-label";
      labelEl.textContent = data.label;
      item.appendChild(labelEl);
      if (data.href) {
        var link = document.createElement("a");
        link.href = data.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = data.text;
        item.appendChild(link);
      } else {
        var span = document.createElement("span");
        span.textContent = data.text;
        item.appendChild(span);
      }
      container.appendChild(item);
    }
  }

  function getAvailableUpgrade(state) {
    for (var i = 0; i < UPGRADES.length; i++) {
      var up = UPGRADES[i];
      if (state.unlockedUpgrades.indexOf(up.id) !== -1) continue;
      if (state.astronauts >= up.threshold) return up;
    }
    return null;
  }

  function updateUpgradeButton(state) {
    var btn = document.getElementById("game-upgrade-btn");
    if (!btn) return;
    var up = getAvailableUpgrade(state);
    if (up) {
      var action;
      if (up.btnText) {
        action = up.btnText;
      } else if (up.type === "handle") {
        action = "unlock " + up.id;
      } else if (up.type === "disco") {
        action = "still here?\nhave a surprise!";
      } else {
        action = "upgrade base";
      }
      btn.textContent =
        action +
        "\n" +
        up.threshold +
        " astronaut" +
        (up.threshold === 1 ? "" : "s");
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }

  function fireUpgrade(state) {
    var up = getAvailableUpgrade(state);
    if (!up) return;
    state.unlockedUpgrades.push(up.id);
    if (up.type === "handle") {
      showNotification(up.label);
      applyUnlocks(state);
    }
    if (up.type === "moonbase") {
      showNotification(up.label);
      updateMoonDisplay(state);
    }
    if (up.type === "disco") {
      showNotification(up.label);
      startDisco();
      var discoBtn = document.getElementById("game-disco-btn");
      if (discoBtn) discoBtn.style.display = "block";
      var discoVol = document.getElementById("game-disco-volume");
      if (discoVol) discoVol.style.display = "block";
    }
    saveState(state);
    updateUpgradeButton(state);
  }

  function resetGame(state) {
    stopDisco();
    state.astronauts = 0;
    state.unlockedUpgrades = [];
    saveState(state);
    updateMoonDisplay(state);
    updateUpgradeButton(state);
    var launchpad = document.getElementById("game-launchpad");
    if (launchpad) launchpad.style.visibility = "visible";
    var discoBtn = document.getElementById("game-disco-btn");
    if (discoBtn) discoBtn.style.display = "none";
    var discoVol = document.getElementById("game-disco-volume");
    if (discoVol) discoVol.style.display = "none";
    var unlocks = document.getElementById("contact-unlocks");
    if (unlocks) {
      while (unlocks.firstChild) unlocks.removeChild(unlocks.firstChild);
    }
  }

  /* ---- Rocket --------------------------------------------------- */
  var rocketInFlight = false;

  function launchRocket(state) {
    if (rocketInFlight) return;
    rocketInFlight = true;

    var launchpad = document.getElementById("game-launchpad");
    if (launchpad) launchpad.style.visibility = "hidden";

    var earthEl = document.getElementById("game-earth");
    var moonEl = document.getElementById("game-moon");
    if (!earthEl || !moonEl) {
      rocketInFlight = false;
      return;
    }

    var er = earthEl.getBoundingClientRect();
    var mr = moonEl.getBoundingClientRect();

    var startX = er.left + er.width / 2;
    var startY = er.top;
    var endX = mr.left + mr.width / 2;
    var endY = mr.top;
    var midX = (startX + endX) / 2;
    var arcHeight = Math.min(window.innerHeight * 0.25, 120);
    var midY = (startY + endY) / 2 - arcHeight;

    var rocket = document.createElement("div");
    rocket.className = "game-rocket";
    rocket.textContent = "\u25b2";
    document.getElementById("game-layer").appendChild(rocket);

    var startTime = performance.now();

    function animate(now) {
      var t = Math.min((now - startTime) / FLIGHT_MS, 1);
      var u = 1 - t;
      var x = u * u * startX + 2 * u * t * midX + t * t * endX;
      var y = u * u * startY + 2 * u * t * midY + t * t * endY;
      rocket.style.left = x + "px";
      rocket.style.top = y + "px";
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        rocket.remove();
        onRocketLand(state);
      }
    }

    requestAnimationFrame(animate);
  }

  function onRocketLand(state) {
    rocketInFlight = false;
    state.astronauts += 1;
    updateMoonDisplay(state);
    updateUpgradeButton(state);
    saveState(state);

    var launchpad = document.getElementById("game-launchpad");
    if (launchpad) launchpad.style.visibility = "visible";
  }

  /* ---- Page swap ------------------------------------------------ */
  function cloneContainerChildren(source, target) {
    while (target.firstChild) target.removeChild(target.firstChild);
    var kids = Array.prototype.slice.call(source.childNodes);
    for (var i = 0; i < kids.length; i++) {
      target.appendChild(document.importNode(kids[i], true));
    }
  }

  function swapContainer(href, state) {
    fetch(href)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var newContainer = doc.querySelector(".container");
        var currentContainer = document.querySelector(".container");
        if (!newContainer || !currentContainer) return;
        cloneContainerChildren(newContainer, currentContainer);
        document.title = doc.title;
        window.scrollTo(0, 0);
        if (typeof window._themeInit === "function") window._themeInit();
        applyUnlocks(state);
        if (discoActive) refreshDiscoCache();
      })
      .catch(function () {
        location.href = href;
      });
  }

  function initPageSwap(state) {
    document.addEventListener("click", function (e) {
      var el = e.target;
      while (el && el !== document) {
        if (el.tagName === "A") break;
        el = el.parentNode;
      }
      var link = el && el.tagName === "A" ? el : null;
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href) return;
      if (
        href.indexOf("://") !== -1 ||
        href.indexOf("mailto:") === 0 ||
        href.indexOf("tel:") === 0 ||
        href.charAt(0) === "#"
      )
        return;
      if (link.target === "_blank") return;
      if (link.hasAttribute("download")) return;
      e.preventDefault();
      history.pushState({}, "", href);
      swapContainer(href, state);
    });

    window.addEventListener("popstate", function () {
      swapContainer(location.href, state);
    });
  }

  /* ---- Game loop ------------------------------------------------ */
  var tickCount = 0;

  function startLoop(state) {
    setInterval(function () {
      tickCount += 1;
      if (tickCount % LAUNCH_EVERY_N_TICKS === 0) {
        launchRocket(state);
      }
    }, TICK_MS);
  }

  /* ---- Init ----------------------------------------------------- */
  function init() {
    var state = loadState();
    injectGameLayer();
    updateMoonDisplay(state);
    applyUnlocks(state);
    updateUpgradeButton(state);

    document
      .getElementById("game-upgrade-btn")
      .addEventListener("click", function () {
        fireUpgrade(state);
      });

    document
      .getElementById("game-reset-btn")
      .addEventListener("click", function () {
        resetGame(state);
      });

    document
      .getElementById("game-disco-btn")
      .addEventListener("click", function () {
        if (discoActive) {
          stopDisco();
        } else {
          startDisco();
        }
      });

    if (state.unlockedUpgrades.indexOf("disco") !== -1) {
      document.getElementById("game-disco-btn").style.display = "block";
      var discoVol = document.getElementById("game-disco-volume");
      if (discoVol) discoVol.style.display = "block";
    }

    // Pause music on tab close so backgrounded autoplay doesn't keep playing.
    window.addEventListener("beforeunload", function () {
      if (discoAudio) discoAudio.pause();
    });

    initPageSwap(state);
    startLoop(state);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
