/* motion.js — animation layer (2026 revamp).
 *
 * Everything here is progressive enhancement on top of the static site:
 * remove this file and the site still works. All motion is gated behind
 * prefers-reduced-motion, and the canvas backdrop pauses when the tab is
 * hidden. No dependencies, no build step.
 */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- Constellation backdrop ----------------------------------- */
  // Sparse drifting points behind the container; nearby points link up and
  // lean gently toward the cursor. Color follows the theme's muted token.

  function startBackdrop() {
    if (reduced.matches) return;
    var canvas = document.createElement("canvas");
    canvas.id = "backdrop";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    var ctx = canvas.getContext("2d");

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var pts = [];
    var mouse = { x: -1e4, y: -1e4 };
    var running = true;
    var color = "128,128,128";

    function themeColor() {
      var v = getComputedStyle(document.documentElement)
        .getPropertyValue("--text-muted").trim();
      // tokens are hex (#808080 / #595959) — convert to "r,g,b"
      if (v[0] === "#" && v.length === 7) {
        color = parseInt(v.slice(1, 3), 16) + "," +
                parseInt(v.slice(3, 5), 16) + "," +
                parseInt(v.slice(5, 7), 16);
      }
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.min(90, Math.floor((W * H) / 16000));
      while (pts.length < target) pts.push(spawn());
      pts.length = target;
    }

    function spawn() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.1,
      };
    }

    var LINK = 110, LINK2 = LINK * LINK;
    var CURSOR = 150, CURSOR2 = CURSOR * CURSOR;

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, dx, dy, d2;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        // gentle pull toward the cursor inside its radius
        dx = mouse.x - p.x; dy = mouse.y - p.y;
        d2 = dx * dx + dy * dy;
        if (d2 < CURSOR2 && d2 > 1) {
          p.x += dx * 0.0015;
          p.y += dy * 0.0015;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = "rgba(" + color + ",0.28)";
        ctx.fill();
      }
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j];
          dx = p.x - q.x; dy = p.y - q.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle =
              "rgba(" + color + "," + (0.13 * (1 - d2 / LINK2)).toFixed(3) + ")";
            ctx.stroke();
          }
        }
        dx = p.x - mouse.x; dy = p.y - mouse.y;
        d2 = dx * dx + dy * dy;
        if (d2 < CURSOR2) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle =
            "rgba(" + color + "," + (0.18 * (1 - d2 / CURSOR2)).toFixed(3) + ")";
          ctx.stroke();
        }
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY;
    });
    window.addEventListener("pointerleave", function () {
      mouse.x = -1e4; mouse.y = -1e4;
    });
    document.addEventListener("visibilitychange", function () {
      var was = running;
      running = !document.hidden;
      if (running && !was) requestAnimationFrame(tick);
    });
    // theme switches change --text-muted: explicit toggles flip data-theme,
    // auto mode follows the system query
    new MutationObserver(themeColor).observe(document.documentElement, {
      attributes: true, attributeFilter: ["data-theme"],
    });
    window.matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", themeColor);

    themeColor();
    resize();
    requestAnimationFrame(tick);
  }

  /* ---- Decode reveal --------------------------------------------- */
  // The tagline resolves out of glyph noise, left to right.

  var GLYPHS = "abcdefghijklmnopqrstuvwxyz<>/{}[]()=+*#";

  function decode(el) {
    var text = el.textContent;
    var frame = 0;
    el.style.visibility = "visible";
    function step() {
      frame++;
      var done = Math.floor(frame * (text.length / 28)); // ~28 frames total
      var out = "";
      for (var i = 0; i < text.length; i++) {
        if (i < done || text[i] === " ") out += text[i];
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (done < text.length) requestAnimationFrame(step);
      else el.textContent = text;
    }
    requestAnimationFrame(step);
  }

  /* ---- Staggered reveal ------------------------------------------ */
  // Sections rise in on load; anything below the fold animates on scroll.
  // Classes are added from JS so the no-JS page stays fully visible.

  function staggerReveal() {
    if (reduced.matches) return;
    var els = document.querySelectorAll(
      ".header, .back-nav, .section, .project, .contact-item"
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.05 });
    var delay = 0;
    els.forEach(function (el) {
      el.classList.add("reveal");
      el.style.transitionDelay = delay + "ms";
      delay += 55;
      io.observe(el);
    });
    // clear delays after entry so hover/theme transitions stay snappy
    setTimeout(function () {
      els.forEach(function (el) { el.style.transitionDelay = ""; });
    }, delay + 600);
  }

  /* ---- Magnetic elements ------------------------------------------ */
  // The name and theme toggle lean a few px toward a nearby cursor.

  function magnetic(el, range, strength) {
    el.style.display = "inline-block";
    el.style.willChange = "transform";
    window.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy;
      var d = Math.hypot(dx, dy);
      if (d < range) {
        var f = (1 - d / range) * strength;
        el.style.transform = "translate(" + dx * f + "px," + dy * f + "px)";
      } else if (el.style.transform) {
        el.style.transform = "";
      }
    });
  }

  /* ---- boot -------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    startBackdrop();
    staggerReveal();
    if (!reduced.matches) {
      var tagline = document.querySelector(".decode");
      if (tagline) decode(tagline);
      var name = document.querySelector(".header .name");
      var toggle = document.getElementById("theme-toggle");
      if (name) magnetic(name, 80, 0.12);
      if (toggle) magnetic(toggle, 60, 0.18);
    }
  });
})();
