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
  // Must stay under the fastest launch cadence (5 ticks = 5s) so a rocket
  // always lands before the next one wants the pad.
  var FLIGHT_MS = 4000;

  var UPGRADES = [
    {
      id: "moonbase-1",
      threshold: 5,
      type: "moonbase",
      label: "\u2726 moon base established",
    },
    {
      id: "bigger-rockets",
      threshold: 8,
      type: "game",
      label: "\u2726 cargo bay built \u2014 rockets carry 2",
      btnText: "build bigger\nrockets",
    },
    {
      id: "leetcode",
      threshold: 12,
      type: "handle",
      label: "\u2726 leetcode unlocked",
    },
    {
      id: "launch-team",
      threshold: 16,
      type: "game",
      label: "\u2726 mission control hired \u2014 faster launches",
      btnText: "hire mission\ncontrol",
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
      id: "rocket-fleet",
      threshold: 38,
      type: "game",
      label: "\u2726 fleet commissioned \u2014 rockets carry 3",
      btnText: "commission\nrocket fleet",
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
      id: "rapid-launch",
      threshold: 80,
      type: "game",
      label: "\u2726 rapid launch protocol \u2014 even faster launches",
      btnText: "speed up\nlaunches",
    },
    {
      id: "disco",
      threshold: 100,
      type: "disco",
      label: "\u2726 surprise unlocked!",
    },
    {
      id: "warp-drive",
      threshold: 150,
      type: "game",
      label: "\u2726 warp drive \u2014 rockets carry 5",
      btnText: "research\nwarp drive",
    },
    {
      id: "steam",
      threshold: 200,
      type: "handle",
      label: "\u2726 steam unlocked",
      btnText: "wow really\nstill here?\nhere's my steam\nI guess",
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
    steam: {
      label: "Steam",
      href: d(
        "\x4d\x51\x51\x55\x56\x1f\x0a\x0a\x56\x51\x40\x44\x48\x46\x4a\x48\x48\x50\x4b\x4c\x51\x5c\x0b\x46\x4a\x48\x0a\x4c\x41\x0a\x48\x5c\x4b\x44\x48\x40\x4f\x40\x43",
      ),
      text: d(
        "\x56\x51\x40\x44\x48\x46\x4a\x48\x48\x50\x4b\x4c\x51\x5c\x0b\x46\x4a\x48\x0a\x4c\x41\x0a\x48\x5c\x4b\x44\x48\x40\x4f\x40\x43",
      ),
    },
  };

  /* ---- ASCII art ------------------------------------------------ */
  // Earth rotates: each row is a cyclic 12-char "map" band; a frame shows a
  // window into each band, shifted by the rotation offset.
  var EARTH_MAP = [
    "  ~~~   .   ",
    " ~~~~~ .  . ",
    "~~~.~~~   . ",
    " ~~  ~~ .   ",
  ];

  function rotStr(s, k) {
    k = k % s.length;
    return s.slice(k) + s.slice(0, k);
  }

  // Land dots get a warm span; ~ (sea) and the frame border keep the
  // element's base color. Spans are added AFTER slicing so the visible
  // window width stays exact.
  function landSpans(s) {
    return s.replace(/\./g, '<span class="land">.</span>');
  }

  function earthFrameHTML(off) {
    var a = landSpans(rotStr(EARTH_MAP[0], off).slice(0, 7));
    var b = landSpans(rotStr(EARTH_MAP[1], off).slice(0, 9));
    var c = landSpans(rotStr(EARTH_MAP[2], off).slice(0, 9));
    var d = landSpans(rotStr(EARTH_MAP[3], off).slice(0, 7));
    return [
      "  .-------.",
      " / " + a + " \\",
      "| " + b + " |",
      "| " + c + " |",
      " \\ " + d + " /",
      "  '-------'",
    ].join("\n");
  }

  var LAUNCHPAD_ASCII = " ^ \n/|\\";

  // Each stage is a list of lines; #game-moon pre centers every line, so the
  // oval comes from symmetric line widths. Stages 1+ get a beacon that blinks.
  // Every line is exactly 17 chars (space-padded), so the centered <pre>
  // can't shuffle rows horizontally. The moon circle is identical at every
  // stage; base structures stack ON the surface above it, beacon on top.
  var MOON_CIRCLE = [
    "    (  .    o   )    ",
    "  (  o     .      )  ",
    " ( .     o       . ) ",
    "(  .      o       . )",
    " ( .      o      . ) ",
    "  (  .     o      )  ",
    "    (    o      )    ",
  ];

  // Structure widths are odd (5/7/9) so they center exactly on the odd
  // 21-char grid — even widths sit half a char off-axis.
  var MOON_STRUCTURES = [
    [],
    ["         [o]         "],
    ["        [o_o]        ", "       [=====]       "],
    [
      "        [o_o]        ",
      "       [=====]       ",
      "      |_______|      ",
    ],
  ];

  function moonFrameHTML(stage, beaconOn) {
    if (stage === 0) return MOON_CIRCLE.join("\n");
    var beacon = beaconOn ? "*" : "·";
    var lines = [
      '          <span class="beacon">' + beacon + "</span>          ",
      '<span class="structure">          |          </span>',
    ].concat(
      MOON_STRUCTURES[stage].map(function (l) {
        return '<span class="structure">' + l + "</span>";
      }),
      MOON_CIRCLE,
    );
    return lines.join("\n");
  }

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
  // iOS ignores HTMLMediaElement.volume (hardware buttons only), so the
  // slider is useless on phones. Mobile instead hides the slider and pins
  // a quiet fixed level through a Web Audio gain node, which iOS honors.
  var MOBILE_MQ = window.matchMedia("(max-width: 768px)");
  var MOBILE_DISCO_GAIN = 0.12;
  var discoGainWired = false;
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
    // once the mobile gain path is wired, the gain node owns loudness;
    // element volume stays 1 so Android and iOS end up equally quiet
    discoAudio.volume = discoGainWired ? 1 : discoVolume * discoVolume;
    return discoAudio;
  }

  function wireQuietMobileGain() {
    if (discoGainWired || !MOBILE_MQ.matches) return;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      var ctx = new Ctx();
      var src = ctx.createMediaElementSource(discoAudio);
      var gain = ctx.createGain();
      gain.gain.value = MOBILE_DISCO_GAIN;
      src.connect(gain);
      gain.connect(ctx.destination);
      if (ctx.state === "suspended") ctx.resume();
      discoGainWired = true;
      discoAudio.volume = 1;
    } catch (_) {}
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
    earth.title = "launch a rocket";
    var launchpad = makeEl("pre", "game-launchpad", LAUNCHPAD_ASCII);
    var earthAscii = makeEl("pre", "game-earth-ascii");
    earthAscii.innerHTML = earthFrameHTML(0);
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

  var beaconOn = true;

  function updateMoonDisplay(state) {
    var moonAscii = document.getElementById("game-moon-ascii");
    var moonCounter = document.getElementById("game-moon-counter");
    if (!moonAscii || !moonCounter) return;
    moonAscii.innerHTML = moonFrameHTML(getMoonStage(state), beaconOn);
    var n = state.astronauts;
    moonCounter.textContent =
      n === 0
        ? ""
        : "\u00b7 " + n + " astronaut" + (n === 1 ? "" : "s") + " \u00b7";
  }

  function pulseCounter() {
    var el = document.getElementById("game-moon-counter");
    if (!el) return;
    el.classList.remove("pulse");
    void el.offsetWidth; // restart the CSS animation
    el.classList.add("pulse");
  }

  /* ---- Derived game stats (from unlocked upgrades) -------------- */
  function has(state, id) {
    return state.unlockedUpgrades.indexOf(id) !== -1;
  }

  function crewSize(state) {
    if (has(state, "warp-drive")) return 5;
    if (has(state, "rocket-fleet")) return 3;
    if (has(state, "bigger-rockets")) return 2;
    return 1;
  }

  function launchEveryTicks(state) {
    if (has(state, "rapid-launch")) return 5;
    if (has(state, "launch-team")) return 7;
    return LAUNCH_EVERY_N_TICKS;
  }

  /* ---- Status line ---------------------------------------------- */
  // In-container mission readout: beacon, astronaut count, launch countdown.
  // Injected by JS (and re-injected after page swaps, which replace the
  // container's children). aria-hidden: it repaints every second and the
  // same numbers live in the moon counter.
  function ensureStatusLine() {
    if (document.getElementById("game-status")) return;
    var container = document.querySelector(".container");
    if (!container) return;
    var status = makeEl("div", "game-status");
    status.setAttribute("aria-hidden", "true");
    status.appendChild(makeEl("span", "game-status-beacon", "●"));
    status.appendChild(makeEl("span", "game-status-crew"));
    status.appendChild(makeEl("span", "game-status-next"));
    container.appendChild(status);
  }

  function updateStatusLine(state) {
    var crew = document.getElementById("game-status-crew");
    var next = document.getElementById("game-status-next");
    if (!crew || !next) return;
    crew.textContent = "astronauts: " + state.astronauts;
    if (rocketInFlight) {
      next.textContent = "rocket in flight";
    } else {
      var every = launchEveryTicks(state);
      var t = every - (tickCount % every);
      next.textContent = "next launch: T−" + t + "s";
    }
  }

  /* ---- Notification -------------------------------------------- */
  var notifTimeout = null;

  function showNotification(text, kindClass) {
    var el = document.getElementById("game-notif");
    if (!el) return;
    if (notifTimeout) clearTimeout(notifTimeout);
    el.className = kindClass || "";
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
    // lets CSS force the art's sea/land/structure spans to inherit the
    // disco colors painted on their parent <pre>
    document.body.classList.add("disco-active");
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
    wireQuietMobileGain();
    audio.currentTime = 0;
    var p = audio.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }

  function stopDisco() {
    if (!discoActive) return;
    discoActive = false;
    document.body.classList.remove("disco-active");
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

  // Mechanics upgrades render green, contact-handle unlocks amber, so the
  // player can tell "improves the game" from "reveals a handle" at a glance.
  function upgradeKindClass(up) {
    if (up.type === "handle") return "kind-handle";
    if (up.type === "moonbase" || up.type === "game") return "kind-game";
    return "";
  }

  function updateUpgradeButton(state) {
    var btn = document.getElementById("game-upgrade-btn");
    if (!btn) return;
    var up = getAvailableUpgrade(state);
    btn.classList.remove("kind-game", "kind-handle");
    if (up) {
      var kind = upgradeKindClass(up);
      if (kind) btn.classList.add(kind);
      var action;
      if (up.btnText) {
        action = up.btnText;
      } else if (up.type === "handle") {
        action = "unlock " + up.id;
      } else if (up.type === "disco") {
        action = "still here?\nhave a surprise!\n(volume alert)";
      } else {
        action = "upgrade base";
      }
      // "game" upgrades always define btnText, so they're covered above
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
      showNotification(up.label, "kind-handle");
      applyUnlocks(state);
    }
    if (up.type === "moonbase") {
      showNotification(up.label, "kind-game");
      updateMoonDisplay(state);
    }
    if (up.type === "game") {
      showNotification(up.label, "kind-game");
    }
    if (up.type === "disco") {
      showNotification(up.label);
      startDisco();
      var discoBtn = document.getElementById("game-disco-btn");
      if (discoBtn) discoBtn.style.display = "block";
      var discoVol = document.getElementById("game-disco-volume");
      if (discoVol && !MOBILE_MQ.matches) discoVol.style.display = "block";
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
    updateStatusLine(state);
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
    updateStatusLine(state);

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
    var lastTrail = 0;

    function dropTrail(x, y) {
      var dot = document.createElement("div");
      dot.className = "game-trail";
      dot.textContent = "·";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      document.getElementById("game-layer").appendChild(dot);
      dot.addEventListener("animationend", function () {
        dot.remove();
      });
    }

    function animate(now) {
      var t = Math.min((now - startTime) / FLIGHT_MS, 1);
      var u = 1 - t;
      var x = u * u * startX + 2 * u * t * midX + t * t * endX;
      var y = u * u * startY + 2 * u * t * midY + t * t * endY;
      rocket.style.left = x + "px";
      rocket.style.top = y + "px";
      if (now - lastTrail > 160) {
        lastTrail = now;
        dropTrail(x, y + 12);
      }
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
    state.astronauts += crewSize(state);
    updateMoonDisplay(state);
    pulseCounter();
    updateUpgradeButton(state);
    updateStatusLine(state);
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
        ensureStatusLine();
        updateStatusLine(state);
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
      if (tickCount % launchEveryTicks(state) === 0) {
        launchRocket(state);
      }
      updateStatusLine(state);
    }, TICK_MS);
  }

  /* ---- Ambient animation (earth spin + beacon blink) ------------ */
  var earthOffset = 0;

  function startAmbient(state) {
    setInterval(function () {
      if (document.hidden) return;
      earthOffset += 1;
      beaconOn = !beaconOn;
      var earthAscii = document.getElementById("game-earth-ascii");
      if (earthAscii) earthAscii.innerHTML = earthFrameHTML(earthOffset);
      var moonAscii = document.getElementById("game-moon-ascii");
      if (moonAscii)
        moonAscii.innerHTML = moonFrameHTML(getMoonStage(state), beaconOn);
    }, 700);
  }

  /* ---- Init ----------------------------------------------------- */
  function init() {
    var state = loadState();

    // Dev/preview hook: ?jz=N seeds N astronauts + auto-unlocks the
    // moonbase/game upgrades below that count (handles stay earned).
    var seed = location.search.match(/[?&]jz=(\d+)/);
    if (seed) {
      state.astronauts = parseInt(seed[1], 10);
      state.unlockedUpgrades = [];
      for (var s = 0; s < UPGRADES.length; s++) {
        var u = UPGRADES[s];
        if (
          (u.type === "moonbase" || u.type === "game") &&
          u.threshold <= state.astronauts
        ) {
          state.unlockedUpgrades.push(u.id);
        }
      }
    }

    injectGameLayer();
    updateMoonDisplay(state);
    applyUnlocks(state);
    updateUpgradeButton(state);
    ensureStatusLine();
    updateStatusLine(state);

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
      if (discoVol && !MOBILE_MQ.matches) discoVol.style.display = "block";
    }

    // Pause music on tab close so backgrounded autoplay doesn't keep playing.
    window.addEventListener("beforeunload", function () {
      if (discoAudio) discoAudio.pause();
    });

    document
      .getElementById("game-earth")
      .addEventListener("click", function () {
        if (rocketInFlight) {
          showNotification("rocket already in flight…");
          return;
        }
        launchRocket(state);
      });

    initPageSwap(state);
    startLoop(state);
    startAmbient(state);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
