/* Patient & Family Resources for andresferber.org (bilingual English / Español).
   Usage on any page:
     <div id="patient-education"></div>
     <script src="https://andresferber.github.io/hemonc-guidelines/patient-education.js"></script>
   Reads patient-education.json next to this file. Not connected to the Landmark Trials project. */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, "") : "";
  var bust = "?v=" + Math.floor(Date.now() / 600000);

  if (!document.getElementById("ped-font")) {
    var lf = document.createElement("link");
    lf.id = "ped-font"; lf.rel = "stylesheet";
    lf.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Literata:opsz,wght@7..72,600&display=swap";
    document.head.appendChild(lf);
  }
  if (!document.getElementById("ped-style")) {
    var css = [
      ".ped{--bg:#f5f7f8;--surface:#fff;--ink:#1d2a33;--muted:#5a6873;--line:#d9e1e6;--accent:#2f6b8a;--accent-soft:#e3eef4;--sage:#3f7a5c;--sage-soft:#e4f0e9;--warn:#8a5a14;--warn-soft:#f6ecd9;",
      "--display:'Literata',Georgia,serif;--body:'Atkinson Hyperlegible',system-ui,-apple-system,'Segoe UI',sans-serif;",
      "font:400 17px/1.55 var(--body);color:var(--ink);text-align:left;max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:20px}",
      ".ped *{box-sizing:border-box}",
      ".ped-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}",
      ".ped h2.ped-h1{font-family:var(--display);font-weight:600;font-size:clamp(26px,5vw,36px);line-height:1.15;margin:0;color:var(--ink);text-wrap:balance}",
      ".ped-lede{color:var(--muted);margin:6px 0 0;max-width:60ch}",
      ".ped-lang{display:flex;border:1px solid var(--line);border-radius:999px;overflow:hidden;flex-shrink:0}",
      ".ped-lang button{font:inherit;font-size:15px;border:0;background:transparent;color:var(--ink);padding:6px 14px;cursor:pointer;margin:0}",
      ".ped-lang button[aria-pressed=true]{background:var(--accent);color:#fff;font-weight:700}",
      ".ped-help{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px 16px;display:grid;gap:4px}",
      ".ped-help strong{font-family:var(--display);font-weight:600;font-size:18px}",
      ".ped-num{font-weight:700;font-variant-numeric:tabular-nums;user-select:all}",
      ".ped-help small{color:var(--muted);font-size:14.5px}",
      ".ped-label{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:700}",
      ".ped-chips{display:flex;flex-wrap:wrap;gap:8px}",
      ".ped-chip{font:inherit;font-size:15px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:6px 14px;cursor:pointer;margin:0}",
      ".ped-chip[aria-pressed=true]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent);font-weight:700}",
      ".ped-search{width:100%;font:inherit;padding:11px 14px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink)}",
      ".ped :focus-visible{outline:3px solid var(--accent);outline-offset:2px}",
      ".ped details{background:var(--surface);border:1px solid var(--line);border-radius:10px}",
      ".ped summary{cursor:pointer;list-style:none;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px}",
      ".ped summary::-webkit-details-marker{display:none}",
      ".ped summary h3{font-family:var(--display);font-weight:600;font-size:20px;margin:0;color:var(--ink)}",
      ".ped-count{font-size:14px;color:var(--muted);white-space:nowrap;margin-left:auto}",
      ".ped summary::after{content:'+';font-size:22px;color:var(--accent);line-height:1}",
      ".ped details[open] summary::after{content:'\\2013'}",
      ".ped-items{border-top:1px solid var(--line)}",
      ".ped-item{padding:12px 16px;display:grid;gap:4px;border-bottom:1px solid var(--line);min-width:0}",
      ".ped-item:last-child{border-bottom:0}",
      ".ped-item.hit{background:var(--accent-soft);box-shadow:inset 0 0 0 2px var(--accent);border-radius:8px}",
      ".ped-item.hit.flash{animation:pedflash 1.4s ease-out}",
      "@keyframes pedflash{0%{box-shadow:inset 0 0 0 4px var(--accent)}100%{box-shadow:inset 0 0 0 2px var(--accent)}}",
      "@media (prefers-reduced-motion:reduce){.ped-item.hit.flash{animation:none}}",
      ".ped-tag.dx{background:var(--accent);color:#fff;font-weight:700}",
      ".ped-item a{color:var(--accent)!important;font-weight:700;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}",
      ".ped-item p{margin:0;color:var(--muted);font-size:15.5px}",
      ".ped-tags{display:flex;flex-wrap:wrap;gap:6px}",
      ".ped-tag{font-size:12.5px;padding:2px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent)}",
      ".ped-tag.es{background:var(--sage-soft);color:var(--sage)}",
      ".ped-tag.new{background:var(--warn-soft);color:var(--warn)}",
      ".ped-empty{color:var(--muted);text-align:center;padding:12px}",
      ".ped-foot{font-size:14px;color:var(--muted);border-top:1px solid var(--line);padding-top:14px;display:grid;gap:4px}",
      ".ped-f1{font-style:italic}"
    ].join("\n");
    var st = document.createElement("style");
    st.id = "ped-style"; st.textContent = css;
    document.head.appendChild(st);
  }

  var T = {
    en: { h1: "Patient & Family Resources", lede: "Trusted, free, non-commercial information about blood cancers and blood disorders. Start with your diagnosis or a topic below.", helpTitle: "Talk to a person", helpBody: 'NCI Cancer Information Service (English and Spanish): <span class="ped-num">1-800-422-6237</span>', helpNote: "For urgent symptoms such as fever during chemotherapy, call your care team or 911.", chipLabel: "Find your diagnosis", q: "Search resources (e.g. fertility, insurance, myeloma)", n: "resources", none: "No resources match. Try another word.", foot1: "Links checked monthly.", foot2: "This page is for education and does not replace advice from your own medical team.", es: "Español", booklet: "Free booklets", phone: "Helpline", "new": "New" },
    es: { h1: "Recursos para pacientes y familias", lede: "Información confiable, gratuita y sin fines comerciales sobre cánceres de la sangre y enfermedades hematológicas. Empiece por su diagnóstico o por un tema.", helpTitle: "Hable con una persona", helpBody: 'Servicio de Información sobre el Cáncer del NCI (inglés y español): <span class="ped-num">1-800-422-6237</span>', helpNote: "Ante síntomas urgentes, como fiebre durante la quimioterapia, llame a su equipo médico o al 911.", chipLabel: "Busque su diagnóstico", q: "Buscar recursos (ej. fertilidad, seguro, mieloma)", n: "recursos", none: "No hay resultados. Pruebe otra palabra.", foot1: "Enlaces revisados cada mes.", foot2: "Esta página es educativa y no reemplaza el consejo de su equipo médico.", es: "Español", booklet: "Folletos gratis", phone: "Línea de ayuda", "new": "Nuevo" }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function mount(root, data) {
    var lang = "en", dx = "all", q = "", openState = null;
    try { var saved = localStorage.getItem("ped-lang"); if (saved === "es" || saved === "en") lang = saved; } catch (e) {}
    root.className = "ped";
    root.innerHTML =
      '<div class="ped-top"><div><h2 class="ped-h1"></h2><p class="ped-lede"></p></div>' +
      '<div class="ped-lang" role="group" aria-label="Language / Idioma"><button type="button" data-l="en">English</button><button type="button" data-l="es">Español</button></div></div>' +
      '<div class="ped-help"><strong class="ped-ht"></strong><span class="ped-hb"></span><small class="ped-hn"></small></div>' +
      '<div style="display:grid;gap:10px"><span class="ped-label"></span><div class="ped-chips"></div>' +
      '<input class="ped-search" id="ped-search" type="search" aria-label="Search"></div>' +
      '<div class="ped-sections" style="display:flex;flex-direction:column;gap:12px"></div>' +
      '<div class="ped-foot"><span class="ped-f1"></span><span class="ped-f2"></span></div>';
    var $ = function (s) { return root.querySelector(s); };

    function tag(t, L) {
      var m = { es: ["es", L.es], booklet: ["", L.booklet], phone: ["", L.phone], "new": ["new", L["new"]] }[t];
      return m ? '<span class="ped-tag ' + m[0] + '">' + esc(m[1]) + "</span>" : "";
    }

    function render() {
      var L = T[lang];
      $(".ped-h1").textContent = L.h1; $(".ped-lede").textContent = L.lede;
      $(".ped-ht").textContent = L.helpTitle; $(".ped-hb").innerHTML = L.helpBody; $(".ped-hn").textContent = L.helpNote;
      $(".ped-label").textContent = L.chipLabel; $(".ped-search").placeholder = L.q;
      $(".ped-f1").textContent = L.foot1; $(".ped-f2").textContent = L.foot2;
      root.querySelectorAll(".ped-lang button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-l") === lang); });
      $(".ped-chips").innerHTML = data.diagnoses.map(function (d) {
        return '<button type="button" class="ped-chip" data-dx="' + d.k + '" aria-pressed="' + (dx === d.k) + '">' + esc(d[lang]) + "</button>";
      }).join("");
      var dets = root.querySelectorAll(".ped-sections details");
      if (dets.length && !q && dx === "all") openState = Array.prototype.map.call(dets, function (d) { return d.open; });
      var html = data.sections.map(function (s, si) {
        var items = s.items.filter(function (it) {
          if (dx !== "all" && it.dx.length && it.dx.indexOf(dx) < 0) return false;
          if (q) { var hay = (it.n + " " + it.en + " " + it.es + " " + s.en + " " + s.es).toLowerCase(); if (hay.indexOf(q) < 0) return false; }
          return true;
        });
        if (!items.length) return "";
        if (dx !== "all") items = items.filter(function (it) { return it.dx.indexOf(dx) >= 0; }).concat(items.filter(function (it) { return it.dx.indexOf(dx) < 0; }));
        var dxName = ""; data.diagnoses.forEach(function (d) { if (d.k === dx) dxName = d[lang]; });
        var isOpen = (q || dx !== "all") ? true : (openState ? openState[si] : s.open);
        return "<details" + (isOpen ? " open" : "") + "><summary><h3>" + esc(s[lang]) + '</h3><span class="ped-count">' + items.length + " " + L.n + "</span></summary>" +
          '<div class="ped-items">' + items.map(function (it) {
            var url = (lang === "es" && it.u_es) ? it.u_es : it.u;
            var hit = dx !== "all" && it.dx.indexOf(dx) >= 0;
            return '<div class="ped-item' + (hit ? ' hit' : '') + '"><a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(it.n) + "</a><p>" + esc(it[lang]) + "</p>" +
              ((hit || it.tags.length) ? '<div class="ped-tags">' + (hit ? '<span class="ped-tag dx">' + esc(dxName) + "</span>" : "") + it.tags.map(function (t) { return tag(t, L); }).join("") + "</div>" : "") + "</div>";
          }).join("") + "</div></details>";
      }).join("");
      $(".ped-sections").innerHTML = html || '<p class="ped-empty">' + esc(L.none) + "</p>";
    }

    root.addEventListener("click", function (e) {
      var b = e.target.closest(".ped-lang button");
      if (b) { lang = b.getAttribute("data-l"); try { localStorage.setItem("ped-lang", lang); } catch (x) {} render(); return; }
      var c = e.target.closest(".ped-chip");
      if (c) {
        dx = c.getAttribute("data-dx"); render();
        var first = root.querySelector(".ped-item.hit");
        if (first) {
          root.querySelectorAll(".ped-item.hit").forEach(function (el) { el.classList.add("flash"); });
          var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          var sec = first.closest("details");
          (sec || first).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
      }
    });
    $(".ped-search").addEventListener("input", function (e) { q = e.target.value.trim().toLowerCase(); render(); });
    render();
  }

  function start() {
    var root = document.getElementById("patient-education");
    if (!root || root.getAttribute("data-ped")) return;
    root.setAttribute("data-ped", "1");
    root.textContent = "Loading…";
    fetch(base + "patient-education.json" + bust).then(function (r) { return r.json(); })
      .then(function (d) { mount(root, d); })
      .catch(function () { root.textContent = "Patient resources could not load. Please refresh the page."; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
