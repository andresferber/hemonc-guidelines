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
      ".hor mark.hss-hit{background:#ffd54a!important;color:inherit!important;padding:0 1px;border-radius:2px}",
      ".hor ol.hog-list > li.hl{box-shadow:-8px 0 0 #fffbe9,-12px 0 0 #e0a800}",
      ".hor ol.hog-list > li.pp{display:grid!important;grid-template-columns:62px 1fr;gap:10px}",
      ".hor .pd{font-size:14px;color:var(--muted);white-space:nowrap;padding-top:1px;line-height:1.35}",
      ".hor .pd.isnew{color:var(--new);font-weight:600}",
      ".hor li.pp .gn{font-size:15.5px}",
      ".hor .lk{font-size:14px;margin-top:3px;display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center}",
      ".hor .more{font-size:14px;padding:10px 0 2px;border-top:1px solid #eef4f6}",
      ".hor .hog-t .rt .badge{background:var(--newbg);color:var(--new)!important}",
      ".hor li.isread .gn a, .hor li.isread .ti a{color:#7a6f8f!important;font-weight:600}",
      ".hor li.isread{opacity:.92}",
      ".hor button.rd{all:unset;cursor:pointer;font:600 13px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:#56656f!important;text-decoration:underline;text-underline-offset:2px}",
      ".hor li.isread button.rd{color:#5b3e96!important;text-decoration:none;background:#f1ecfa;border-radius:999px;padding:3px 8px}",
      ".hor button.syncm,.hdg button.syncm{all:unset;cursor:pointer;font:600 14px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:#145a75!important;text-decoration:underline;text-underline-offset:2px}",
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
  /* highlight the words searched in the Page ONE search box inside the item it opened */
  function markSearched(li) {
    var words = [];
    try { words = window.__hssWords || JSON.parse(sessionStorage.getItem("hssWords") || "[]"); } catch (e) {}
    try { sessionStorage.removeItem("hssWords"); } catch (e) {}
    window.__hssWords = null;
    [].slice.call(document.querySelectorAll("mark.hss-hit")).forEach(function (m) {
      var p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
    });
    words = (words || []).filter(function (w) { return w && w.length >= 2; });
    if (!words.length) return;
    var walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) { if (!n.parentNode.closest("form, button, script, style")) nodes.push(n); }
    nodes.forEach(function (node) {
      var text = node.nodeValue, low = norm(text);
      if (low.length !== text.length) low = text.toLowerCase();
      var ranges = [];
      words.forEach(function (w) {
        var i = 0;
        while ((i = low.indexOf(w, i)) >= 0) { ranges.push([i, i + w.length]); i += w.length; }
      });
      if (!ranges.length) return;
      ranges.sort(function (a, b) { return a[0] - b[0]; });
      var merged = [];
      ranges.forEach(function (r) { var last = merged[merged.length - 1]; if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]); else merged.push(r.slice()); });
      var frag = document.createDocumentFragment(), pos = 0;
      merged.forEach(function (r) {
        if (r[0] > pos) frag.appendChild(document.createTextNode(text.slice(pos, r[0])));
        var mk = document.createElement("mark"); mk.className = "hss-hit"; mk.textContent = text.slice(r[0], r[1]);
        frag.appendChild(mk); pos = r[1];
      });
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    });
  }

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

  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function shortDate(d) {
    var m = String(d || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return "";
    var thisYear = new Date().getFullYear() === +m[1];
    return MON[+m[2] - 1] + " " + (+m[3]) + (thisYear ? "" : ", " + m[1]);
  }
  function isRecent(d, days) {
    var m = String(d || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? (Date.now() - new Date(+m[1], +m[2] - 1, +m[3]).getTime()) / 864e5 <= days : false;
  }
  /* "already opened" marks: kept only in this browser (localStorage), never sent anywhere.
     Shared by Recent papers and the Weekly digest (same key), by PubMed ID when known. */
  var RK = "hogRead";
  function readMap() { try { return JSON.parse(localStorage.getItem(RK) || "{}") || {}; } catch (e) { return {}; } }
  function isRead(id) { return !!(id && readMap()[id]); }
  function setRead(id, on) {
    if (!id) return;
    var m = readMap(), now = Date.now();
    if (on) m[id] = now; else delete m[id];
    for (var k in m) if (now - m[k] > 365 * 864e5) delete m[k];          // forget after a year
    try { localStorage.setItem(RK, JSON.stringify(m)); } catch (e) {}
    applyRead();
  }
  function applyRead() {
    var m = readMap();
    [].forEach.call(document.querySelectorAll("li[data-rid]"), function (li) {
      var on = !!m[li.getAttribute("data-rid")];
      li.classList.toggle("isread", on);
      var b = li.querySelector("button.rd");
      if (b) { b.textContent = on ? "✓ Opened" : "Mark as opened"; b.setAttribute("aria-pressed", on ? "true" : "false"); }
    });
  }
  window.addEventListener("storage", function (e) { if (e.key === RK) applyRead(); });
  window.addEventListener("hog-marks", applyRead);
  /* ---- "Sync marks" between devices by link (shared by resources.js and digest.js) ----
     The link carries the list of opened / listened papers in its #hash. The hash is never sent
     to any server; opening it on another device merges the marks into that browser. */
  if (!window.hogSync) window.hogSync = (function () {
    var KEYS = { o: "hogRead", h: "hogHeard" }, EPOCH = 19000;  // days since 1970; 19000 = Jan 2022
    function load(k) { try { return JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch (e) { return {}; } }
    function save(k, m) { try { localStorage.setItem(k, JSON.stringify(m)); } catch (e) {} }
    function encId(id) {
      if (/^pm\d+$/.test(id)) return (+id.slice(2)).toString(36);
      return "~" + encodeURIComponent(id).replace(/[,.;]/g, function (c) { return "%" + c.charCodeAt(0).toString(16).toUpperCase(); });
    }
    function decId(s) { return s.charAt(0) === "~" ? decodeURIComponent(s.slice(1)) : "pm" + parseInt(s, 36); }
    function encode() {
      var parts = [];
      for (var t in KEYS) {
        var m = load(KEYS[t]), items = [];
        for (var id in m) items.push(encId(id) + "." + Math.max(0, Math.floor(m[id] / 864e5) - EPOCH).toString(36));
        if (items.length) parts.push(t + ":" + items.join(","));
      }
      return parts.join(";");
    }
    function counts() { return { o: Object.keys(load(KEYS.o)).length, h: Object.keys(load(KEYS.h)).length }; }
    function link() {
      var base = location.origin + location.pathname;
      if (!/andresferber\.org$/i.test(location.hostname)) base = "https://www.andresferber.org/";
      return base + "#hogsync=" + encode();
    }
    function merge(str) {
      var added = { o: 0, h: 0 };
      str.split(";").forEach(function (sec) {
        var t = sec.slice(0, 1), k = KEYS[t];
        if (!k || sec.charAt(1) !== ":") return;
        var m = load(k);
        sec.slice(2).split(",").forEach(function (it) {
          var j = it.lastIndexOf("."); if (j < 1) return;
          try {
            var id = decId(it.slice(0, j)), ts = (parseInt(it.slice(j + 1), 36) + EPOCH) * 864e5 + 432e5;
            if (!/^pm\d+$|^u/.test(id) || isNaN(ts)) return;
            if (!m[id]) { m[id] = ts; added[t]++; }
          } catch (e) {}
        });
        save(k, m);
      });
      try { window.dispatchEvent(new Event("hog-marks")); } catch (e) {}
      return added;
    }
    var css = [
      ".hog-sync{position:fixed;inset:0;z-index:10001;background:rgba(10,20,26,.45);display:flex;align-items:center;justify-content:center;padding:16px;font:400 16px/1.45 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:#1f2a33;text-align:left}",
      ".hog-sync[hidden],.hog-toast[hidden]{display:none!important}",
      ".hog-sync .box{background:#fff;border-radius:12px;max-width:440px;width:100%;padding:20px;box-shadow:0 20px 50px -15px rgba(0,0,0,.45);display:flex;flex-direction:column;gap:12px}",
      ".hog-sync h3{margin:0!important;font:700 18px/1.25 'Source Sans 3',system-ui,sans-serif!important;color:#1f2a33!important;text-transform:none!important;letter-spacing:0!important}",
      ".hog-sync p{margin:0!important;padding:0!important;font-size:15px;color:#33434c}",
      ".hog-sync ol{margin:0!important;padding:0 0 0 20px!important;font-size:15px;color:#33434c}",
      ".hog-sync ol li{list-style:decimal!important;background:none!important;padding:2px 0!important;margin:0!important}",
      ".hog-sync textarea{width:100%;height:64px;font:400 12.5px/1.3 ui-monospace,Menlo,monospace;color:#33434c;border:1px solid #9cc9d8;border-radius:8px;padding:8px;resize:none;box-sizing:border-box}",
      ".hog-sync .row{display:flex;flex-wrap:wrap;gap:8px}",
      ".hog-sync button{all:unset;box-sizing:border-box;cursor:pointer;flex:1 1 auto;text-align:center;font:600 15px/1 'Source Sans 3',system-ui,sans-serif!important;color:#145a75!important;background:#fff!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:12px 14px!important}",
      ".hog-sync button[hidden]{display:none!important}",
      ".hog-sync button.main{background:#145a75!important;color:#fff!important;border-color:#145a75!important}",
      ".hog-sync button:focus-visible{outline:3px solid rgba(20,90,117,.45);outline-offset:2px}",
      ".hog-sync .ok{font-size:14px;color:#1d6b3d;min-height:1em}",
      ".hog-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:10001;max-width:calc(100vw - 24px);width:480px;background:#1d6b3d;color:#fff;border-radius:12px;padding:12px 16px;font:600 15px/1.35 'Source Sans 3',system-ui,sans-serif;box-shadow:0 10px 30px -8px rgba(0,0,0,.45)}"
    ].join("\n");
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    function pin(el) {
      document.documentElement.appendChild(el);
      if (window.MutationObserver) new MutationObserver(function () { if (el.parentNode !== document.documentElement) document.documentElement.appendChild(el); })
        .observe(document.body, { childList: true, subtree: true });
    }
    var dlg = document.createElement("div");
    dlg.className = "hog-sync"; dlg.hidden = true; dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-label", "Sync marks with my other devices");
    dlg.innerHTML = '<div class="box"><h3>Sync marks with your other devices</h3>' +
      '<p class="cnt"></p>' +
      '<ol><li>Send this link to your other device, for example by Messages, Mail or AirDrop to yourself.</li>' +
      '<li>Open the link there. Its marks are added to that device; nothing is removed.</li>' +
      '<li>To match both ways, do the same from the other device.</li></ol>' +
      '<textarea readonly aria-label="Sync link"></textarea><p class="ok" aria-live="polite"></p>' +
      '<div class="row"><button class="main share" type="button">Share link</button><button class="copy" type="button">Copy link</button><button class="close" type="button">Close</button></div>' +
      '<p style="font-size:13.5px;color:#56656f">The link holds only the list of papers you marked. It is not stored on this website or anywhere else.</p></div>';
    pin(dlg);
    var toast = document.createElement("div"); toast.className = "hog-toast"; toast.hidden = true; toast.setAttribute("role", "status"); pin(toast);
    function show(msg) { toast.textContent = msg; toast.hidden = false; setTimeout(function () { toast.hidden = true; }, 7000); }
    function open() {
      var c = counts(), url = link();
      dlg.querySelector(".cnt").textContent = "On this device: " + c.o + " opened" + (c.h ? ", " + c.h + " listened" : "") + ".";
      dlg.querySelector("textarea").value = url;
      dlg.querySelector(".ok").textContent = "";
      dlg.querySelector(".share").hidden = !navigator.share;
      dlg.hidden = false;
      dlg.querySelector(navigator.share ? ".share" : ".copy").focus();
    }
    dlg.addEventListener("click", function (e) {
      var url = dlg.querySelector("textarea").value, ok = dlg.querySelector(".ok");
      if (e.target === dlg || e.target.closest(".close")) { dlg.hidden = true; return; }
      if (e.target.closest(".share")) {
        navigator.share({ title: "andresferber.org marks", url: url }).catch(function () {});
      } else if (e.target.closest(".copy")) {
        var ta = dlg.querySelector("textarea");
        var done = function () { ok.textContent = "Link copied. Paste it into a message to yourself."; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { ta.select(); try { document.execCommand("copy"); done(); } catch (er) { ok.textContent = "Select the link above and copy it."; } });
        else { ta.select(); try { document.execCommand("copy"); done(); } catch (er) { ok.textContent = "Select the link above and copy it."; } }
      }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !dlg.hidden) dlg.hidden = true; });
    /* import when the page is opened from a sync link */
    var hm = location.hash.match(/^#hogsync=(.*)$/);
    if (hm) {
      var a = merge(hm[1]);
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
      setTimeout(function () {
        show(a.o || a.h ? "Marks synced: " + a.o + " opened" + (a.h ? " and " + a.h + " listened" : "") + " added to this device." : "Marks synced: this device already had all of them.");
      }, 800);
    }
    return { open: open };
  })();


  function paperHTML(it, q) {
    var pp = it.paper, meta = [pp.j, pp.a].filter(Boolean).join(". ");
    var rid = pp.p ? "pm" + pp.p : "u" + it.u;
    var links = '<div class="lk">' + (pp.p ? '<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(pp.p) + '/" target="_blank" rel="noopener">PubMed</a> ' : "") +
      '<button class="rd" type="button">' + (isRead(rid) ? "\u2713 Opened" : "Mark as opened") + "</button></div>";
    return '<li class="pp' + (isRead(rid) ? " isread" : "") + '" data-rid="' + esc(rid) + '"><div class="pd' + (isRecent(pp.d, 7) ? " isnew" : "") + '">' + esc(shortDate(pp.d)) + "</div><div>" +
      '<div class="gn"><a href="' + esc(it.u) + '" target="_blank" rel="noopener">' + hilite(it.n, q) + "</a></div>" +
      '<div class="ref">' + hilite(meta, q) + (pp.ty ? ' <span class="badge ol">' + esc(pp.ty) + "</span>" : "") + "</div>" + links + "</div></li>";
  }

  function rowHTML(it, q, sec, idx) {
    if (it.paper) return paperHTML(it, q);
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
    if (!panels) {
      el.innerHTML = key === "papers" ? '<p style="color:#56656f">The paper lists could not be loaded. Please reload the page.</p>' : "";
      return;
    }
    var total = 0;
    panels.forEach(function (p) { total += p.items.length; });
    var withSearch = total > 15;
    el.innerHTML = '<div class="hor">' +
      (withSearch ? '<div class="hog-bar"><input class="hog-q" type="search" placeholder="Search ' + esc(data.titles[key].toLowerCase()) + '" aria-label="Search ' + esc(data.titles[key]) + '">' +
        '<button class="hog-btn hog-all" type="button">Open all</button></div><div class="hog-status" aria-live="polite"></div>' : "") +
      '<div class="hog-acc"></div>' +
      (key === "papers" && data.papersBuilt ? '<p class="hog-foot">Updated daily from PubMed and the journals\u2019 own feeds; last update ' + esc(data.papersBuilt) + '. Newest first. Your \u201cOpened\u201d marks stay on this device: <button class="syncm" type="button">sync them with your other devices</button>.</p>' : "") +
      (key === "calc" ? '<p class="hog-foot">Missing a calculator or found an error? <a href="mailto:' + MAIL + '?subject=Calculators%20section">Send a suggestion</a>.</p>' : "") + "</div>";
    var root = el.firstChild, state = { q: "" };

    function render() {
      var q = norm(state.q.trim()), acc = root.querySelector(".hog-acc"), open = {}, html = "", hits = 0;
      acc.querySelectorAll(".hog-item.open").forEach(function (n) { open[n.getAttribute("data-k")] = 1; });
      panels.forEach(function (p) {
        var items = p.items.filter(function (it) { return !q || norm([it.n, it.x, it.note, it.paper ? it.paper.j + " " + it.paper.a : domain(it.u), p.title].join(" ")).indexOf(q) >= 0; });
        if (q && !items.length) return;
        hits += items.length;
        var isOpen = q ? true : !!open[p.key];
        html += '<div class="hog-item' + (isOpen ? " open" : "") + '" data-k="' + esc(p.key) + '">' +
          '<button class="hog-t" type="button" aria-expanded="' + isOpen + '"><span class="nm">' + esc(p.title) + "</span>" +
          '<span class="rt">' + (p.fresh && !q ? '<span class="badge">' + p.fresh + " new</span>" : "") + "<span>" + (q ? items.length + " of " + p.items.length : p.items.length) + '</span><span class="pm" aria-hidden="true">' + (isOpen ? "–" : "+") + "</span></span>" +
          '<span class="sb">' + esc(p.sub) + "</span></button>" +
          '<div class="hog-c"><ol class="hog-list">' + items.map(function (it, i) { return rowHTML(it, q, key + "-" + p.key, i); }).join("") + "</ol>" +
          (p.home ? '<p class="more">More at <a href="' + esc(p.home[1]) + '" target="_blank" rel="noopener">' + esc(p.home[0]) + "</a></p>" : "") + "</div></div>";
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
      if (ev.target.closest("button.syncm")) { window.hogSync.open(); return; }
      var rli = ev.target.closest("li[data-rid]");
      if (rli && ev.target.closest("button.rd")) { setRead(rli.getAttribute("data-rid"), !isRead(rli.getAttribute("data-rid"))); return; }
      if (rli && ev.target.closest("a")) setRead(rli.getAttribute("data-rid"), true);
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

    (window.__hogClosers = window.__hogClosers || []).push(function (except) {
      [].slice.call(root.querySelectorAll('.hog-item[data-sopen="1"]')).forEach(function (it) {
        if (except && it.contains(except)) return;
        it.removeAttribute("data-sopen");
        toggle(it, false);
      });
    });

    function jumpTo(id) {
      var panel = null;
      panels.forEach(function (p) { p.items.forEach(function (it) { if ("rs-" + key + "-" + slug(it.n) === id) panel = p.key; }); });
      if (!panel) return;
      if (state.q) { state.q = ""; var qi = root.querySelector(".hog-q"); if (qi) qi.value = ""; render(); }
      var item = root.querySelector('.hog-item[data-k="' + panel + '"]');
      if (item && !item.classList.contains("open")) { toggle(item, true); item.setAttribute("data-sopen", "1"); }
      var li = document.getElementById(id);
      if (li) {
        [].slice.call(document.querySelectorAll("li.hl")).forEach(function (x) { x.classList.remove("hl"); });
        markSearched(li);
        li.scrollIntoView({ behavior: "smooth", block: "center" });
        li.classList.add("hl");
        setTimeout(function () { li.classList.remove("hl"); }, 4000);
      }
    }
    function fromHash() {
      var h = decodeURIComponent(location.hash.replace(/^#/, ""));
      if (h.indexOf("rs-" + key + "-") === 0) setTimeout(function () { jumpTo(h); }, 50);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }

  /* the papers list is fetched separately, the first time a papers section appears on the page */
  function withPapers(data) {
    if (data.sections.papers || !document.querySelector('[data-hog-section="papers"]')) return Promise.resolve(data);
    if (!window.__horPapers) {
      window.__horPapers = fetch(base + "papers.json" + bust).then(function (r) { return r.json(); }).then(function (pj) {
        data.titles.papers = "Recent papers";
        data.papersBuilt = pj.built;
        data.sections.papers = pj.feeds.filter(function (f) { return f.items && f.items.length; }).map(function (f) {
          return { key: f.key, title: f.title, sub: f.sub, home: f.home,
            fresh: f.items.filter(function (x) { return isRecent(x.d, 7); }).length,
            items: f.items.map(function (x) { return { n: x.t, u: x.u, paper: x }; }) };
        });
        return data;
      }).catch(function () { return data; });
    }
    return window.__horPapers;
  }
  function mountAll(data) {
    document.querySelectorAll("[data-hog-section]").forEach(function (el) {
      if (el.getAttribute("data-hog-section") === "papers") {
        withPapers(data).then(function (d) { mountSection(el, d); });
      } else mountSection(el, data);
    });
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
