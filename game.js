(function () {
  "use strict";

  /* ---- Constants ------------------------------------------------ */
  var STORAGE_KEY = "jz_game";
  var TICK_MS = 1000;
  var LAUNCH_EVERY_N_TICKS = 15;
  var FLIGHT_MS = 5000;

  var UPGRADES = [
    { id: "moonbase-1", threshold: 5, type: "moonbase" },
    {
      id: "leetcode",
      threshold: 12,
      type: "handle",
      label: "\u2726 leetcode unlocked",
    },
    { id: "moonbase-2", threshold: 20, type: "moonbase" },
    {
      id: "twitter",
      threshold: 30,
      type: "handle",
      label: "\u2726 twitter unlocked",
    },
    { id: "moonbase-3", threshold: 45, type: "moonbase" },
    {
      id: "riot",
      threshold: 60,
      type: "handle",
      label: "\u2726 riot unlocked",
    },
  ];

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
    "   (   )\n  (     )\n (       )\n  (     )\n   (   )",
    "     |\n   (   )\n  (     )\n (       )\n  (     )\n   (   )",
    "     |\n   (   )\n  ([___])\n (       )\n  (     )\n   (   )",
    "     |\n   (   )\n  ([___])\n ( |___| )\n  (_____)\n   (   )",
  ];

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
    var upgradeBtn = makeEl("button", "game-upgrade-btn", "[ upgrade ]");
    moon.appendChild(moonAscii);
    moon.appendChild(moonCounter);
    moon.appendChild(upgradeBtn);

    var notif = makeEl("div", "game-notif");
    var resetBtn = makeEl("button", "game-reset-btn", "reset game");

    layer.appendChild(earth);
    layer.appendChild(moon);
    layer.appendChild(notif);
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

  /* ---- Unlocks -------------------------------------------------- */
  function applyUnlocks(state) {
    var handles = document.querySelectorAll(".locked-handle");
    for (var i = 0; i < handles.length; i++) {
      var el = handles[i];
      if (state.unlockedUpgrades.indexOf(el.dataset.unlock) !== -1) {
        el.style.display = "";
      }
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
    btn.style.display = getAvailableUpgrade(state) ? "" : "none";
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
      updateMoonDisplay(state);
    }
    saveState(state);
    updateUpgradeButton(state);
  }

  function resetGame(state) {
    state.astronauts = 0;
    state.unlockedUpgrades = [];
    saveState(state);
    updateMoonDisplay(state);
    updateUpgradeButton(state);
    var handles = document.querySelectorAll(".locked-handle");
    for (var i = 0; i < handles.length; i++) {
      handles[i].style.display = "none";
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

    initPageSwap(state);
    startLoop(state);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
