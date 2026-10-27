/* Hematology images slideshow for andresferber.org (Page ONE), in the Page ONE design.
   Usage:
     <div id="hemonc-slides"></div>
     <script src="https://andresferber.github.io/hemonc-guidelines/slideshow.js"></script>
   Reads slides.json next to this file: [{f, w, h, c}] (image file, size, caption).
   Images are stored without metadata (no location data); see tools/add_slides.py. */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, "") : "";
  var bust = "?v=" + Math.floor(Date.now() / 600000);
  var DELAY = 6000;
  var mount = document.getElementById("hemonc-slides");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "hemonc-slides";
    if (me && me.parentNode) me.parentNode.insertBefore(mount, me); else document.body.appendChild(mount);
  }
  if (mount.getAttribute("data-done")) return;
  mount.setAttribute("data-done", "1");

  var css = [
    ".hsl{--deep:#145a75;--ink:#1f2a33;--muted:#56656f;--rule:#8fbccb;font:400 15px/1.45 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);text-align:left;max-width:640px;margin:0 auto}",
    ".hsl *{box-sizing:border-box}",
    ".hsl .stage{position:relative;aspect-ratio:4/3;max-width:100%;border:1px solid var(--rule);border-radius:10px;overflow:hidden;background:#eef2ee;touch-action:pan-y}",
    ".hsl .sl{position:absolute;inset:0;opacity:0;transition:opacity .7s ease;pointer-events:none}",
    ".hsl .sl.on{opacity:1;pointer-events:auto}",
    ".hsl .sl .bg{position:absolute;inset:-20px;background-size:cover;background-position:center;filter:blur(18px) saturate(.9);opacity:.55}",
    ".hsl .sl img{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain;cursor:zoom-in;border:0!important;margin:0!important;padding:0!important;box-shadow:none!important}",
    ".hsl button.nav{all:unset;box-sizing:border-box;position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.88)!important;color:var(--deep)!important;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.18)!important;z-index:2}",
    ".hsl button.nav:hover{background:#fff!important}",
    ".hsl button.prev{left:10px}.hsl button.next{right:10px}",
    ".hsl button:focus-visible{outline:3px solid #ffd54a!important;outline-offset:2px}",
    ".hsl .bar{display:flex;align-items:center;gap:10px;margin-top:8px;min-height:28px}",
    ".hsl .cap{flex:1 1 auto;min-width:0;font-size:15px;color:var(--ink)}",
    ".hsl .cnt{flex:none;font-size:13.5px;color:var(--muted);font-variant-numeric:tabular-nums}",
    ".hsl button.pp{all:unset;box-sizing:border-box;flex:none;cursor:pointer;font:600 13.5px/1 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;border:1px solid #9cc9d8!important;border-radius:7px;padding:7px 10px!important;background:#fff!important;height:auto!important;text-transform:none!important}",
    ".hsl .dots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px}",
    ".hsl .dots button{all:unset;box-sizing:border-box;width:10px;height:10px;border-radius:50%;background:#c4dbe3!important;cursor:pointer}",
    ".hsl .dots button[aria-current='true']{background:var(--deep)!important}",
    /* full-size viewer */
    ".hsl-lb{position:fixed;inset:0;z-index:10000;background:rgba(10,20,26,.92);display:flex;align-items:center;justify-content:center;padding:calc(48px + env(safe-area-inset-top,0px)) 16px calc(56px + env(safe-area-inset-bottom,0px))}",
    ".hsl-lb[hidden]{display:none}",
    ".hsl-lb img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,.5)}",
    ".hsl-lb .lbcap{position:absolute;left:16px;right:16px;bottom:calc(14px + env(safe-area-inset-bottom,0px));text-align:center;color:#fff;font:400 15px/1.4 'Source Sans 3',system-ui,sans-serif}",
    ".hsl-lb button{all:unset;box-sizing:border-box;position:absolute;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font:400 26px/1 'Source Sans 3',system-ui,sans-serif}",
    ".hsl-lb button:hover{background:rgba(255,255,255,.26)}",
    ".hsl-lb .x{top:calc(12px + env(safe-area-inset-top,0px));right:12px}",
    ".hsl-lb .l{left:12px;top:50%;transform:translateY(-50%)}.hsl-lb .r{right:12px;top:50%;transform:translateY(-50%)}",
    "@media (prefers-reduced-motion:reduce){.hsl .sl{transition:none}}"
  ].join("\n");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var ARR_L = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARR_R = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  fetch(base + "slides.json" + bust).then(function (r) { return r.json(); }).then(build).catch(function () { mount.innerHTML = ""; });

  function build(slides) {
    if (!slides || !slides.length) return;
    var n = slides.length, cur = 0, timer = null, paused = false, hover = false, visible = true;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) paused = true;

    mount.innerHTML = '<div class="hsl" role="region" aria-roledescription="carousel" aria-label="Hematology images">' +
      '<div class="stage">' + slides.map(function (s, i) {
        var src = base + s.f;
        return '<div class="sl' + (i === 0 ? " on" : "") + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + n + '">' +
          '<div class="bg" data-bg="' + esc(src) + '"></div>' +
          '<img alt="' + esc(s.c || "Peripheral blood smear") + '" data-src="' + esc(src) + '" width="' + s.w + '" height="' + s.h + '"></div>';
      }).join("") +
      (n > 1 ? '<button class="nav prev" type="button" aria-label="Previous image">' + ARR_L + '</button><button class="nav next" type="button" aria-label="Next image">' + ARR_R + "</button>" : "") +
      '</div><div class="bar"><div class="cap" aria-live="polite"></div><span class="cnt"></span>' +
      (n > 1 ? '<button class="pp" type="button"></button>' : "") + "</div>" +
      (n > 1 ? '<div class="dots">' + slides.map(function (s, i) { return '<button type="button" aria-label="Image ' + (i + 1) + '"></button>'; }).join("") + "</div>" : "") +
      "</div>";
    var root = mount.firstChild, els = root.querySelectorAll(".sl"), dots = root.querySelectorAll(".dots button");

    var lb = document.createElement("div");
    lb.className = "hsl-lb"; lb.hidden = true;
    lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = '<img alt=""><div class="lbcap"></div><button class="x" type="button" aria-label="Close">✕</button>' +
      (n > 1 ? '<button class="l" type="button" aria-label="Previous image">‹</button><button class="r" type="button" aria-label="Next image">›</button>' : "");
    /* attach to <html>, outside Weebly's phone-layout page wrapper, which moves anything in <body>
     into a transformed container and so breaks position:fixed; put it back if anything moves it */
  (function pin(el) {
    document.documentElement.appendChild(el);
    if (window.MutationObserver) new MutationObserver(function () {
      if (el.parentNode !== document.documentElement) document.documentElement.appendChild(el);
    }).observe(document.body, { childList: true, subtree: true });
  })(lb);

    function load(i) {
      var el = els[(i + n) % n], img = el.querySelector("img"), bg = el.querySelector(".bg");
      if (!img.getAttribute("src")) img.src = img.getAttribute("data-src");
      if (!bg.style.backgroundImage) bg.style.backgroundImage = 'url("' + bg.getAttribute("data-bg") + '")';
    }
    function show(i) {
      cur = (i + n) % n;
      [].forEach.call(els, function (el, k) { el.classList.toggle("on", k === cur); el.setAttribute("aria-hidden", k !== cur); });
      [].forEach.call(dots, function (d, k) { d.setAttribute("aria-current", k === cur ? "true" : "false"); });
      load(cur); load(cur + 1);
      root.querySelector(".cap").textContent = slides[cur].c || "";
      root.querySelector(".cnt").textContent = n > 1 ? (cur + 1) + " / " + n : "";
      if (!lb.hidden) openLB();
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      var pp = root.querySelector(".pp");
      if (pp) pp.textContent = paused ? "Play" : "Pause";
      if (n > 1 && !paused && !hover && visible && lb.hidden) timer = setTimeout(function () { show(cur + 1); }, DELAY);
    }
    function openLB() {
      var s = slides[cur];
      lb.querySelector("img").src = base + s.f;
      lb.querySelector("img").alt = s.c || "Peripheral blood smear";
      lb.querySelector(".lbcap").textContent = s.c || "";
      if (lb.hidden) { lb.hidden = false; lb.querySelector(".x").focus(); }
      clearTimeout(timer);
    }
    function closeLB() { lb.hidden = true; schedule(); }

    root.addEventListener("click", function (e) {
      if (e.target.closest(".prev")) show(cur - 1);
      else if (e.target.closest(".next")) show(cur + 1);
      else if (e.target.closest(".pp")) { paused = !paused; schedule(); }
      else if (e.target.closest(".dots button")) show([].indexOf.call(dots, e.target.closest(".dots button")));
      else if (e.target.closest(".sl img")) openLB();
    });
    lb.addEventListener("click", function (e) {
      if (e.target.closest(".l")) show(cur - 1);
      else if (e.target.closest(".r")) show(cur + 1);
      else if (e.target.closest(".x") || e.target === lb) closeLB();
    });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowLeft") show(cur - 1);
      else if (e.key === "ArrowRight") show(cur + 1);
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); }
    });
    var stage = root.querySelector(".stage");
    stage.addEventListener("mouseenter", function () { hover = true; schedule(); });
    stage.addEventListener("mouseleave", function () { hover = false; schedule(); });
    root.addEventListener("focusin", function () { hover = true; schedule(); });
    root.addEventListener("focusout", function () { hover = false; schedule(); });
    /* swipe */
    var x0 = null, y0 = null;
    stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { paused = true; show(cur + (dx < 0 ? 1 : -1)); }
      x0 = null;
    });
    /* only play while on screen */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(); }, { threshold: 0.3 }).observe(stage);
    }
    document.addEventListener("visibilitychange", function () { visible = !document.hidden; schedule(); });
    show(0);
  }
})();
