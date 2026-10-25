/* One search box for Page ONE of andresferber.org: guidelines, useful tools, educational
   resources and calculators. Not connected to the Landmark Trials project. Usage:
     <div id="hemonc-search"></div>
     <script src="https://andresferber.github.io/hemonc-guidelines/sitesearch.js"></script>
   Reads guidelines.json and resources.json next to this file. Results open the matching item
   on Page ONE via #gl- and #rs- anchors. */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, "") : "";
  var PAGE_ONE = "https://www.andresferber.org/";
  var bust = "?v=" + Math.floor(Date.now() / 600000);
  var PER_GROUP = 6;

  var mount = document.getElementById("hemonc-search");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "hemonc-search";
    if (me && me.parentNode) me.parentNode.insertBefore(mount, me); else document.body.appendChild(mount);
  }
  if (mount.getAttribute("data-done")) return;
  mount.setAttribute("data-done", "1");

  if (!document.getElementById("hog-font")) {
    var lf = document.createElement("link");
    lf.id = "hog-font"; lf.rel = "stylesheet";
    lf.href = "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap";
    document.head.appendChild(lf);
  }
  var css = [
    ".hss{--ink:#1f2a33;--muted:#56656f;--deep:#145a75;--rule:#cfe3ea;--sky2:#d6f2fc;position:relative;font:400 16px/1.45 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);text-align:left}",
    ".hss *{box-sizing:border-box}",
    ".hss .q{all:unset;box-sizing:border-box;display:block;width:100%;font:400 17px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important;background:#fff!important;border:1px solid #8fbccb!important;border-radius:10px;padding:13px 16px 13px 44px!important;height:auto!important;text-transform:none!important;box-shadow:0 1px 2px rgba(16,40,60,.06)}",
    ".hss .q:focus{outline:3px solid rgba(20,90,117,.3);outline-offset:1px}",
    ".hss .mag{position:absolute;left:15px;top:15px;color:var(--muted);pointer-events:none}",
    ".hss .res{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:50;background:#fff;border:1px solid #8fbccb;border-radius:10px;box-shadow:0 12px 28px -10px rgba(16,40,60,.35);max-height:min(70vh,520px);overflow:auto;padding:6px 0}",
    ".hss .res[hidden]{display:none}",
    ".hss .grp{font:700 13.5px/1.2 'Source Sans 3',system-ui,sans-serif;color:var(--deep);padding:10px 16px 4px;display:flex;justify-content:space-between;gap:8px}",
    ".hss .grp span{font-weight:400;color:var(--muted)}",
    ".hss a.hit{display:block;padding:7px 16px;text-decoration:none!important;color:var(--ink)!important;line-height:1.35}",
    ".hss a.hit:hover,.hss a.hit.on{background:var(--sky2)}",
    ".hss a.hit .t{display:block;font-weight:600;font-size:15.5px;overflow-wrap:anywhere}",
    ".hss a.hit .m{display:block;font-size:13.5px;color:var(--muted);overflow-wrap:anywhere}",
    ".hss mark{background:#fff0a8;color:inherit;padding:0}",
    ".hss .none{padding:12px 16px;color:var(--muted);font-size:15px}",
    ".hss .hint{padding:8px 16px 6px;border-top:1px solid #eef4f6;margin-top:4px;font-size:12.5px;color:var(--muted)}"
  ].join("\n");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
  function hilite(text, words) {
    var t = esc(text);
    words.forEach(function (w) {
      if (w.length < 2) return;
      var re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      t = t.replace(re, "<mark>$1</mark>");
    });
    return t;
  }
  function getJSON(u) { return fetch(u + bust).then(function (r) { if (!r.ok) throw 0; return r.json(); }).catch(function () { return null; }); }

  mount.innerHTML = '<div class="hss" role="search">' +
    '<svg class="mag" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
    '<input class="q" type="search" autocomplete="off" placeholder="Search guidelines, tools and calculators" aria-label="Search the site" aria-controls="hss-res" aria-expanded="false">' +
    '<div class="res" id="hss-res" role="listbox" hidden></div></div>';
  var root = mount.firstChild, input = root.querySelector(".q"), box = root.querySelector(".res");
  var ITEMS = [];

  Promise.all([getJSON(base + "guidelines.json"), getJSON(base + "resources.json")])
    .then(function (r) {
      var g = r[0], res = r[1];
      if (g) g.entries.forEach(function (e) {
        if (e.old || e.dup) return;
        ITEMS.push({ grp: "Guidelines", t: e.n, m: [e.o, e.d && e.d.slice(0, 4)].filter(Boolean).join(", "),
          h: norm([e.n, e.o, e.x, e.s, e.t, e.j].join(" ")), href: PAGE_ONE + "#gl-" + e.k });
      });
      if (res) {
        var names = { calc: "Calculators", tools: "Useful tools", edu: "Educational resources" };
        ["calc", "tools", "edu"].forEach(function (sec) {
          (res.sections[sec] || []).forEach(function (p) {
            p.items.forEach(function (it) {
              ITEMS.push({ grp: names[sec], t: it.n, m: p.title, h: norm([it.n, it.x, p.title, p.sub].join(" ")),
                href: PAGE_ONE + "#rs-" + sec + "-" + slug(it.n) });
            });
          });
        });
      }
    });

  var ORDER = ["Guidelines", "Calculators", "Useful tools", "Educational resources"];
  var sel = -1;

  function search(q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) { close(); return; }
    var groups = {};
    ITEMS.forEach(function (it) {
      var hay = norm(it.t) + " " + it.h;
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return;
      var title = norm(it.t), score = 0;
      words.forEach(function (w) { if (title.indexOf(w) >= 0) score--; });
      (groups[it.grp] = groups[it.grp] || []).push({ it: it, s: score });
    });
    var html = "", n = 0;
    ORDER.forEach(function (gname) {
      var list = groups[gname];
      if (!list) return;
      list.sort(function (a, b) { return a.s - b.s; });
      html += '<div class="grp">' + esc(gname) + (list.length > PER_GROUP ? "<span>" + PER_GROUP + " of " + list.length + "</span>" : "") + "</div>";
      list.slice(0, PER_GROUP).forEach(function (o) {
        html += '<a class="hit" role="option" href="' + esc(o.it.href) + '">' +
          '<span class="t">' + hilite(o.it.t, words) + '</span><span class="m">' + esc(o.it.m) + "</span></a>";
        n++;
      });
    });
    box.innerHTML = n ? html + '<div class="hint">Add a word to narrow the results. Enter opens the highlighted result.</div>'
      : '<div class="none">' + (ITEMS.length ? "Nothing found for “" + esc(q) + "”. Try a disease, a drug, a society or a score name." : "Loading…") + "</div>";
    box.hidden = false;
    input.setAttribute("aria-expanded", "true");
    sel = -1;
  }
  function close() { box.hidden = true; input.setAttribute("aria-expanded", "false"); sel = -1; }
  function move(d) {
    var hits = box.querySelectorAll("a.hit");
    if (!hits.length) return;
    if (sel >= 0) hits[sel].classList.remove("on");
    sel = (sel + d + hits.length) % hits.length;
    hits[sel].classList.add("on");
    hits[sel].scrollIntoView({ block: "nearest" });
  }

  var timer;
  input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { search(input.value); }, 100); });
  input.addEventListener("focus", function () { if (input.value.trim()) search(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Escape") { close(); }
    else if (e.key === "Enter") {
      var hits = box.querySelectorAll("a.hit");
      var target = hits[sel >= 0 ? sel : 0];
      if (target) { e.preventDefault(); target.click(); }
    }
  });
  box.addEventListener("click", function (e) {
    var a = e.target.closest("a.hit");
    if (!a) return;
    var href = a.getAttribute("href"), hash = href.slice(href.indexOf("#"));
    var m = hash.match(/^#rs-([a-z]+)-/);
    var here = hash.indexOf("#gl-") === 0 ? document.getElementById("hemonc-guidelines")
      : m ? document.querySelector('[data-hog-section="' + m[1] + '"]')
      : null;
    if (here) {
      href = hash;
      e.preventDefault();
      close();
      if (location.hash === href) window.dispatchEvent(new HashChangeEvent("hashchange"));
      else location.hash = href;
    }
  });
  document.addEventListener("click", function (e) { if (!root.contains(e.target)) close(); });
})();
