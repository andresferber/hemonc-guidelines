/* Page ONE link sections for andresferber.org: Useful tools, Educational resources, Calculators.
   Same look as the Guidelines section. Usage (one embed per section, anywhere on a page):
     <div data-hog-section="tools"></div>   (or "edu", or "calc")
     <script src="https://andresferber.github.io/hemonc-guidelines/resources.js"></script>
   Reads resources.json next to this file. Safe to include the script more than once. */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, "") : "";
  var bust = "?v=" + Math.floor(Date.now() / 600000);
  var MAIL = "andresferber@hotmail.com";

  if (!document.getElementById("hog-font")) {
    var lf = document.createElement("link");
    lf.id = "hog-font"; lf.rel = "stylesheet";
    lf.href = "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap";
    document.head.appendChild(lf);
  }
  if (!document.getElementById("hor-style")) {
    var css = [
      ".hor{container-type:inline-size;--sky:#a9e4f8;--sky2:#d6f2fc;--ink:#1f2a33;--muted:#56656f;--deep:#145a75;--rule:#cfe3ea;--paper:#fff;--new:#9a5a00;--newbg:#fff1d6;",
      "font:400 16px/1.5 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);text-align:left;display:flex;flex-direction:column;gap:12px;font-variant-numeric:tabular-nums}",
      ".hor *{box-sizing:border-box}",
      ".hor a{color:var(--deep)!important;text-decoration:underline!important;text-underline-offset:2px;text-decoration-thickness:1px}",
      ".hor a:hover{text-decoration-thickness:2px}",
      ".hor p{margin:0!important;padding:0!important}",
      ".hor .hog-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
      ".hor .hog-q{all:unset;box-sizing:border-box;flex:1 1 240px;min-width:0;font:400 16px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important;background:var(--paper)!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:11px 14px!important;height:auto!important;text-transform:none!important}",
      ".hor .hog-q:focus{outline:3px solid rgba(20,90,117,.28);outline-offset:1px}",
      ".hor button.hog-btn{all:unset;box-sizing:border-box;cursor:pointer;font:600 14px/1 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;background:var(--paper)!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:12px 14px!important;height:auto!important;text-transform:none!important;box-shadow:none!important}",
      ".hor button.hog-btn:hover{background:var(--sky2)!important}",
      ".hor button:focus-visible,.hor input:focus-visible{outline:3px solid rgba(20,90,117,.45)!important;outline-offset:2px}",
      ".hor .hog-status{font-size:14px;color:var(--muted)}",
      ".hor .hog-status:empty{display:none}",
      ".hor .hog-acc{display:flex;flex-direction:column}",
      ".hor .hog-item{border:1px solid #8fbccb;margin-top:-1px;background:var(--paper)}",
      ".hor .hog-item:first-child{border-radius:8px 8px 0 0}",
      ".hor .hog-item:last-child{border-radius:0 0 8px 8px}",
      ".hor .hog-t{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:center;width:100%;padding:12px 16px!important;background:var(--sky)!important;color:var(--ink)!important;height:auto!important;text-transform:none!important;box-shadow:none!important}",
      ".hor .hog-item:first-child .hog-t{border-radius:7px 7px 0 0}",
      ".hor .hog-item:last-child:not(.open) .hog-t{border-radius:0 0 7px 7px}",
      ".hor .hog-t:hover{background:#97dcf4!important}",
      ".hor .hog-item.open > .hog-t{background:#76cae9!important}",
      ".hor .hog-t .nm{font:700 16.5px/1.25 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important}",
      ".hor .hog-t .sb{grid-column:1;font-size:14px;color:#2f4a55;line-height:1.3}",
      ".hor .hog-t .rt{grid-row:1/span 2;grid-column:2;display:flex;gap:8px;align-items:center;font-size:14px;color:#2f4a55;white-space:nowrap}",
      ".hor .hog-t .pm{font:400 22px/1 'Source Sans 3',system-ui,sans-serif;width:18px;text-align:center;color:var(--deep)}",
      ".hor .hog-c{display:none;padding:4px 16px 12px}",
      ".hor .hog-item.open > .hog-c{display:block}",
      ".hor ol.hog-list{margin:0!important;padding:0!important;list-style:none!important}",
      ".hor ol.hog-list > li{display:block!important;list-style:none!important;background:none!important;margin:0!important;padding:10px 0!important;border-bottom:1px solid #eef4f6;text-indent:0!important}",
      ".hor ol.hog-list > li:last-child{border-bottom:0}",
      ".hor .gn{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px;font-weight:600;font-size:16px;line-height:1.35;min-width:0}",
      ".hor .gn > a, .hor .gn > span.nmx{overflow-wrap:anywhere}",
      ".hor .gn a{color:var(--ink)!important;text-decoration-color:#9cc9d8!important}",
      ".hor .gn a:hover{color:var(--deep)!important}",
      ".hor .gn .dom{font-weight:400;font-size:13.5px;color:var(--muted);overflow-wrap:anywhere}",
      ".hor .note{font-size:15px;color:#33434c;margin-top:2px}",
      ".hor .ref{font-size:14px;color:var(--muted);margin-top:2px}",
      ".hor .badge{display:inline-block;font:600 12.5px/1 'Source Sans 3',system-ui,sans-serif;padding:4px 7px;border-radius:999px;background:#e3f1f6;color:var(--deep)!important;white-space:nowrap}",
      ".hor .badge.warn{background:var(--newbg);color:var(--new)!important}",
      ".hor .badge.ol{background:#eef0f1;color:#5d676d!important}",
      /* built-in calculator */
      ".hor .calc{margin-top:8px;display:flex;flex-wrap:wrap;gap:10px 14px;align-items:flex-end;background:#f3fafd;border:1px solid var(--rule);border-radius:8px;padding:12px}",
      ".hor .calc label{display:flex;flex-direction:column;gap:4px;font-size:14px;color:var(--muted)}",
      ".hor .calc input{all:unset;box-sizing:border-box;width:120px;font:400 16px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important;background:#fff!important;border:1px solid #9cc9d8!important;border-radius:6px;padding:8px 10px!important;height:auto!important}",
      ".hor .calc output{flex:1 1 220px;min-width:0;font-size:15px;color:var(--ink);padding-bottom:6px}",
      ".hor .calc output b{color:var(--deep);font-size:17px}",
      ".hor .calc .why{display:block;font-size:13.5px;color:var(--muted)}",
      ".hor ol.hog-list > li.hl{background:#fffbe9!important;transition:background 1.2s}",
      ".hor .hog-empty{padding:12px 0;color:var(--muted)}",
      ".hor .hog-foot{font-size:13.5px;color:var(--muted);line-height:1.5}",
      ".hor mark{background:#fff0a8;color:inherit;padding:0 1px}",
      "@container (max-width:460px){.hor .gn .dom{flex-basis:100%}.hor .hog-t{padding:10px 12px!important}.hor .hog-c{padding:4px 12px 10px}.hor .calc input{width:100%}.hor .calc label{flex:1 1 100%}}",
      "@media (max-width:560px){.hor .hog-t .sb{display:none}}",
      "@media print{.hor .hog-bar{display:none}.hor .hog-c{display:block!important}}"
    ].join("\n");
    var st = document.createElement("style");
    st.id = "hor-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function hilite(text, q) {
    var raw = String(text || ""), i = q ? norm(raw).indexOf(q) : -1;
    if (i < 0) return esc(raw);
    return esc(raw.slice(0, i)) + "<mark>" + esc(raw.slice(i, i + q.length)) + "</mark>" + esc(raw.slice(i + q.length));
  }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
  function domain(u) {
    var m = String(u || "").match(/^https?:\/\/(?:www\.)?([^\/?#]+)/i);
    return m ? m[1] : "";
  }

  /* ---------- built-in calculators ---------- */
  var WIDGETS = {
    iss: function (id) {
      return '<form class="calc" data-calc="iss" novalidate>' +
        '<label for="' + id + '-b2m">Serum β2-microglobulin (mg/L)<input id="' + id + '-b2m" name="b2m" inputmode="decimal" autocomplete="off"></label>' +
        '<label for="' + id + '-alb">Serum albumin (g/dL)<input id="' + id + '-alb" name="alb" inputmode="decimal" autocomplete="off"></label>' +
        '<output aria-live="polite">Enter both values.</output></form>';
    }
  };
  function runCalc(form) {
    var out = form.querySelector("output");
    if (form.getAttribute("data-calc") === "iss") {
      var b = parseFloat(String(form.b2m.value).replace(",", "."));
      var a = parseFloat(String(form.alb.value).replace(",", "."));
      if (isNaN(b) || isNaN(a)) { out.innerHTML = "Enter both values."; return; }
      var stage, why;
      if (b < 3.5 && a >= 3.5) { stage = "I"; why = "β2M below 3.5 mg/L and albumin 3.5 g/dL or higher"; }
      else if (b >= 5.5) { stage = "III"; why = "β2M 5.5 mg/L or higher"; }
      else { stage = "II"; why = "Neither stage I nor stage III"; }
      out.innerHTML = "<b>ISS stage " + stage + "</b><span class=\"why\">" + why + ". Greipp et al. J Clin Oncol 2005.</span>";
    }
  }

  function rowHTML(it, q, sec, idx) {
    var badges = "";
    if (it.widget) badges += '<span class="badge">Built in</span>';
    if (it.login) badges += '<span class="badge ol">Login required</span>';
    if (it.note) badges += '<span class="badge warn">' + esc(it.note) + "</span>";
    var name = it.u
      ? '<a href="' + esc(it.u) + '" target="_blank" rel="noopener">' + hilite(it.n, q) + "</a>"
      : '<span class="nmx">' + hilite(it.n, q) + "</span>";
    var dom = it.u ? '<span class="dom">' + esc(domain(it.u)) + "</span>" : "";
    var ref = it.ref ? '<div class="ref">Reference: <a href="' + esc(it.ref[1]) + '" target="_blank" rel="noopener">' + esc(it.ref[0]) + "</a></div>" : "";
    var w = it.widget && WIDGETS[it.widget] ? WIDGETS[it.widget]("hor-" + sec + "-" + idx) : "";
    return "<li id=\"rs-" + sec.split("-")[0] + "-" + slug(it.n) + "\"><div class=\"gn\">" + name + badges + dom + "</div>" +
      (it.x ? '<p class="note">' + hilite(it.x, q) + "</p>" : "") + ref + w + "</li>";
  }

  function mountSection(el, data) {
    if (el.getAttribute("data-hog-done")) return;
    el.setAttribute("data-hog-done", "1");
    var key = el.getAttribute("data-hog-section");
    var panels = data.sections[key];
    if (!panels) { el.innerHTML = ""; return; }
    var total = 0;
    panels.forEach(function (p) { total += p.items.length; });
    var withSearch = total > 15;
    el.innerHTML = '<div class="hor">' +
      (withSearch ? '<div class="hog-bar"><input class="hog-q" type="search" placeholder="Search ' + esc(data.titles[key].toLowerCase()) + '" aria-label="Search ' + esc(data.titles[key]) + '">' +
        '<button class="hog-btn hog-all" type="button">Open all</button></div><div class="hog-status" aria-live="polite"></div>' : "") +
      '<div class="hog-acc"></div>' +
      (key === "calc" ? '<p class="hog-foot">Missing a calculator or found an error? <a href="mailto:' + MAIL + '?subject=Calculators%20section">Send a suggestion</a>.</p>' : "") + "</div>";
    var root = el.firstChild, state = { q: "" };

    function render() {
      var q = norm(state.q.trim()), acc = root.querySelector(".hog-acc"), open = {}, html = "", hits = 0;
      acc.querySelectorAll(".hog-item.open").forEach(function (n) { open[n.getAttribute("data-k")] = 1; });
      panels.forEach(function (p) {
        var items = p.items.filter(function (it) { return !q || norm([it.n, it.x, it.note, domain(it.u), p.title].join(" ")).indexOf(q) >= 0; });
        if (q && !items.length) return;
        hits += items.length;
        var isOpen = q ? true : !!open[p.key];
        html += '<div class="hog-item' + (isOpen ? " open" : "") + '" data-k="' + esc(p.key) + '">' +
          '<button class="hog-t" type="button" aria-expanded="' + isOpen + '"><span class="nm">' + esc(p.title) + "</span>" +
          '<span class="rt"><span>' + (q ? items.length + " of " + p.items.length : p.items.length) + '</span><span class="pm" aria-hidden="true">' + (isOpen ? "–" : "+") + "</span></span>" +
          '<span class="sb">' + esc(p.sub) + "</span></button>" +
          '<div class="hog-c"><ol class="hog-list">' + items.map(function (it, i) { return rowHTML(it, q, key + "-" + p.key, i); }).join("") + "</ol></div></div>";
      });
      acc.innerHTML = html || '<p class="hog-empty">Nothing matches “' + esc(state.q) + '”.</p>';
      var s = root.querySelector(".hog-status");
      if (s) s.textContent = q ? hits + (hits === 1 ? " match" : " matches") : "";
    }
    function toggle(item, on) {
      on = on == null ? !item.classList.contains("open") : on;
      item.classList.toggle("open", on);
      var b = item.querySelector(".hog-t");
      b.setAttribute("aria-expanded", on);
      b.querySelector(".pm").textContent = on ? "–" : "+";
    }
    render();
    root.addEventListener("click", function (ev) {
      var t = ev.target.closest(".hog-t");
      if (t) { toggle(t.parentNode); return; }
      var all = ev.target.closest(".hog-all");
      if (all) {
        var items = root.querySelectorAll(".hog-item");
        var anyClosed = [].some.call(items, function (i) { return !i.classList.contains("open"); });
        items.forEach(function (i) { toggle(i, anyClosed); });
        all.textContent = anyClosed ? "Close all" : "Open all";
      }
    });
    root.addEventListener("input", function (ev) {
      var f = ev.target.closest("form.calc");
      if (f) { runCalc(f); return; }
      if (ev.target.classList.contains("hog-q")) {
        clearTimeout(state.t);
        state.t = setTimeout(function () { state.q = ev.target.value; render(); }, 120);
      }
    });
    root.addEventListener("submit", function (ev) { ev.preventDefault(); });

    function jumpTo(id) {
      var panel = null;
      panels.forEach(function (p) { p.items.forEach(function (it) { if ("rs-" + key + "-" + slug(it.n) === id) panel = p.key; }); });
      if (!panel) return;
      if (state.q) { state.q = ""; var qi = root.querySelector(".hog-q"); if (qi) qi.value = ""; render(); }
      var item = root.querySelector('.hog-item[data-k="' + panel + '"]');
      if (item) toggle(item, true);
      var li = document.getElementById(id);
      if (li) {
        li.scrollIntoView({ behavior: "smooth", block: "center" });
        li.classList.add("hl");
        setTimeout(function () { li.classList.remove("hl"); }, 1800);
      }
    }
    function fromHash() {
      var h = decodeURIComponent(location.hash.replace(/^#/, ""));
      if (h.indexOf("rs-" + key + "-") === 0) setTimeout(function () { jumpTo(h); }, 50);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }

  function mountAll(data) {
    document.querySelectorAll("[data-hog-section]").forEach(function (el) { mountSection(el, data); });
  }

  var w = window;
  if (w.__horData) { mountAll(w.__horData); return; }
  if (w.__horLoading) { w.__horLoading.then(mountAll); return; }
  w.__horLoading = fetch(base + "resources.json" + bust)
    .then(function (r) { return r.json(); })
    .then(function (d) { w.__horData = d; return d; });
  w.__horLoading.then(mountAll).catch(function () {
    document.querySelectorAll("[data-hog-section]:not([data-hog-done])").forEach(function (el) {
      el.innerHTML = '<p style="color:#56656f">This list could not be loaded. Please reload the page.</p>';
    });
  });
})();
