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


  /* ===== SAVED CORE: identical in resources.js, digest.js and guidelines.js =====
     One shared list for the whole site, kept in this browser (localStorage key hogSaved). Nothing is sent anywhere unless the owner
     turns on sync (SYNC_URL below, hidden from readers); removals are remembered in hogSavedDel so sync can carry them.
     Entry: { m: time last changed (used to merge devices),  s: "papers"|"digest"|"guide", g: topic heading, n: title, u: link, t: time saved, o: organisation,
              x: note or conclusion, xl: its label, k: guideline key, paper: { p: PMID, j: journal, a: authors, d: date, ty: type } }
     A snapshot is stored, so a saved item stays after it leaves its feed. Backups are plain JSON files the reader
     downloads and restores. Every write re-reads the store first, so the three sections never overwrite each other. */
  var SK = "hogSaved", DK = "hogSavedDel", MK = "hogSavedMod", SAVED = {}, DELS = {}, saveWarn = false, firstSave = {};
  /* Owner-only sync: address of the sync Worker (see sync/README.md). Empty = sync is off and invisible. */
  var SYNC_URL = "", SYNC_KEYK = "hogSyncKey", SYNC_SHOWK = "hogSyncShow", SYNC_LASTK = "hogSyncLast";
  var STORE_WARN = "Saved for this visit only: this browser is blocking storage on this device.";
  var SECTIONS = [["papers", "Recent papers"], ["digest", "Weekly digest"], ["guide", "Guidelines"]];
  function entryId(c) { return c.s + ":" + (c.s === "guide" ? c.k : (c.paper && c.paper.p ? "pm" + c.paper.p : "u" + c.u)); }
  function makeSid(s, p, u, k) { return entryId({ s: s, k: k || "", u: u || "", paper: { p: p || "" } }); }
  /* validate everything that comes from storage or from a backup file: only http(s) links, plain-text fields */
  function cleanSaved(raw) {
    var out = {}, list = Array.isArray(raw) ? raw : (raw && typeof raw === "object" ? Object.keys(raw).map(function (k) { return raw[k]; }) : []);
    list.slice(0, 2000).forEach(function (e) {
      if (!e || typeof e !== "object" || typeof e.n !== "string" || !e.n || !/^https?:\/\//i.test(String(e.u || ""))) return;
      var s = /^(papers|digest|guide)$/.test(String(e.s)) ? String(e.s) : "papers";
      var pp = e.paper && typeof e.paper === "object" ? e.paper : {};
      var c = {
        s: s, g: String(e.g || "").slice(0, 120), n: e.n.slice(0, 500), u: String(e.u).slice(0, 600), t: +e.t || 0, m: +e.m || +e.t || 0,
        o: String(e.o || "").slice(0, 300), x: String(e.x || "").slice(0, 1500), xl: String(e.xl || "").slice(0, 60),
        k: /^[A-Za-z0-9_.\-]{1,80}$/.test(String(e.k || "")) ? String(e.k) : "",
        paper: {
          p: /^\d{1,9}$/.test(String(pp.p || "")) ? String(pp.p) : "",
          j: String(pp.j || "").slice(0, 200), a: String(pp.a || "").slice(0, 200),
          d: /^\d{4}(-\d{2}){0,2}/.test(String(pp.d || "")) ? String(pp.d).slice(0, 10) : "",
          ty: String(pp.ty || "").slice(0, 120)
        }
      };
      if (s === "guide" && !c.k) return;
      out[entryId(c)] = c;
    });
    return out;
  }
  function readStore() { try { return cleanSaved(JSON.parse(localStorage.getItem(SK) || "[]")); } catch (e) { return null; } }
  function readDels() {
    var o = {};
    try {
      var j = JSON.parse(localStorage.getItem(DK) || "{}");
      if (j && typeof j === "object" && !Array.isArray(j)) Object.keys(j).slice(0, 5000).forEach(function (k) {
        var v = +j[k]; if (v > 0 && /^(papers|digest|guide):.{1,700}$/.test(k)) o[k] = v;
      });
    } catch (e) {}
    return o;
  }
  function syncSaved() { if (saveWarn) return; var m = readStore(); if (m) { SAVED = m; DELS = readDels(); } }
  function lsGet(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function lsSet(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function fmtWhen(ms) { try { return new Date(ms).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } }
  function savedList(src) {
    return Object.keys(SAVED).map(function (k) { return SAVED[k]; })
      .filter(function (e) { return !src || e.s === src; })
      .sort(function (a, b) { return b.t - a.t; });
  }
  function persistSaved(noTouch) {
    saveWarn = false;
    try {
      localStorage.setItem(SK, JSON.stringify(savedList()));
      localStorage.setItem(DK, JSON.stringify(DELS));
      if (!noTouch) localStorage.setItem(MK, String(Date.now()));
    } catch (e) { saveWarn = true; }
  }
  function savedChanged() { window.dispatchEvent(new Event("hog-saved")); }
  function applySaved() {
    [].forEach.call(document.querySelectorAll("button.sv[data-sid]"), function (b) {
      if (b.classList.contains("rm")) return;
      var on = !!SAVED[b.getAttribute("data-sid")];
      b.textContent = on ? "★ Saved" : "☆ Save";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  var inSavedRows = false;   // true while a Saved row is being drawn: its buttons read Remove
  function saveBtnHTML(sidv, label) {
    var on = !!SAVED[sidv];
    if (inSavedRows && on) return '<button class="sv rm" type="button" data-sid="' + esc(sidv) + '" aria-label="Remove from saved">\u2715 Remove</button>';
    return '<button class="sv" type="button" data-sid="' + esc(sidv) + '" aria-label="' + esc(label) + '" aria-pressed="' + on + '">' + (on ? "\u2605 Saved" : "\u2606 Save") + "</button>";
  }
  /* save or unsave one snapshot; returns true (now saved), false (removed) or null (nothing done) */
  function toggleSaveEntry(snap) {
    var c = cleanSaved([snap]), id = Object.keys(c)[0], now = null;
    if (!id) return null;
    syncSaved();
    if (SAVED[id]) { delete SAVED[id]; DELS[id] = Date.now(); now = false; } else { SAVED[id] = c[id]; SAVED[id].m = Date.now(); delete DELS[id]; now = true; }
    persistSaved(); savedChanged(); scheduleSync();
    return now;
  }

  var toastEl, toastT;
  /* small message at the bottom of the screen; with act = { label, fn } it also offers a button (used for Undo).
     The action lives on the element so that whichever of the three scripts made it, the click finds it. */
  function toast(msg, act) {
    toastEl = document.getElementById("hor-toast");
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "hor-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      toastEl.addEventListener("click", function (e) {
        var bt = e.target.closest ? e.target.closest("button") : null, f = toastEl._act;
        if (!bt || !f) return;
        toastEl._act = null; toastEl.className = "";
        f();
      });
      document.body.appendChild(toastEl);
    }
    toastEl._act = act && act.fn ? act.fn : null;
    toastEl.textContent = msg;
    if (act && act.label) {
      var bt = document.createElement("button");
      bt.type = "button"; bt.textContent = act.label;
      toastEl.appendChild(bt);
    }
    toastEl.className = act ? "on act" : "on";
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.className = ""; toastEl._act = null; }, act ? 6500 : 3800);
  }
  function saveToast(now, where, snap) {
    if (now === null) return;
    if (saveWarn) { toast(STORE_WARN); return; }
    if (!now) {
      toast("Removed from saved.", snap ? { label: "Undo", fn: function () { var r = toggleSaveEntry(snap); if (r) toast("Restored."); } } : null);
      return;
    }
    if (!firstSave[where]) { firstSave[where] = 1; toast("Saved. Find it under \u201c" + where + "\u201d at the top of this list."); } else toast("Saved.");
  }

  /* group a list of saved entries by topic heading: headings follow the order the section shows its topics in */
  function groupSaved(list, order) {
    var by = {}, names = [];
    list.forEach(function (e) { var g = e.g || "Other"; (by[g] = by[g] || []).push(e); });
    (order || []).forEach(function (g) { if (by[g] && names.indexOf(g) < 0) names.push(g); });
    Object.keys(by).sort().forEach(function (g) { if (names.indexOf(g) < 0 && g !== "Other") names.push(g); });
    if (by.Other) names.push("Other");
    return names.map(function (g) { return { g: g, items: by[g] }; });
  }
  function savedGroupsHTML(list, order, rowFn, listClass) {
    inSavedRows = true;
    try {
      return groupSaved(list, order).map(function (grp) {
        return '<h4 class="sv-g">' + esc(grp.g) + ' <span class="sv-gn">' + grp.items.length + '</span></h4><ol class="' + listClass + '">' +
          grp.items.map(rowFn).join("") + "</ol>";
      }).join("");
    } finally { inSavedRows = false; }
  }
  function syncKey() { return lsGet(SYNC_KEYK); }
  function syncVisible() { return !!SYNC_URL && (!!syncKey() || lsGet(SYNC_SHOWK) === "1"); }
  var syncErr = "";
  function syncStatus() {
    if (window.__hogSyncBusy) return "Syncing\u2026";
    if (syncErr) return "Not synced: " + syncErr;
    var t = +lsGet(SYNC_LASTK);
    return t ? "Sync is on \u00b7 last synced " + fmtWhen(t) : "Sync is on";
  }
  function syncHTML() {
    if (!syncVisible()) return "";
    if (!syncKey()) return '<div class="sv-sync"><label class="sv-lab">Sync key <input class="sv-key" type="password" autocomplete="off" spellcheck="false" aria-label="Sync key"></label>' +
      '<button class="sv-btn" type="button" data-sv="syncon">Turn on sync</button></div>';
    return '<div class="sv-sync"><span class="sv-sync-st" role="status">' + esc(syncStatus()) + "</span>" +
      '<button class="sv-btn" type="button" data-sv="syncnow">Sync now</button><button class="sv-btn" type="button" data-sv="syncoff">Turn off sync</button></div>';
  }
  function savedToolsHTML() {
    var n = savedList().length, mod = +lsGet(MK), synced = syncVisible() && !!syncKey();
    return '<div class="sv-tools">' +
      (n ? '<button class="sv-btn" type="button" data-sv="copy">Copy list</button><button class="sv-btn" type="button" data-sv="dl">Download backup</button>' : "") +
      '<button class="sv-btn" type="button" data-sv="imp">Restore from backup</button>' +
      '<input class="sv-file" type="file" accept=".json,application/json" aria-label="Choose a saved-items backup file" tabindex="-1"></div>' +
      syncHTML() +
      '<p class="sv-foot sv-mod">On this device: ' + n + " saved item" + (n === 1 ? "" : "s") + (mod ? " \u00b7 last changed " + esc(fmtWhen(mod)) : "") + ".</p>" +
      '<p class="sv-foot">' + (synced ? "Sync is on, so this list is also kept online under your private sync key and matched across your synced devices. "
        : "Saved items stay in this browser on this device only; nothing is sent anywhere. ") +
      "The list and the backup include everything you saved on this site (papers, weekly digest and guidelines). To keep them or move them to another device, download a backup and restore it there." +
      (saveWarn ? " <b>This browser is blocking storage, so saves last only until you close the page.</b>" : "") + "</p>";
  }

  function exportText() {
    var lines = ["Saved items – andresferber.org", "Exported " + new Date().toISOString().slice(0, 10), ""];
    SECTIONS.forEach(function (sec) {
      var list = savedList(sec[0]);
      if (!list.length) return;
      lines.push("=== " + sec[1] + " ===", "");
      groupSaved(list, []).forEach(function (grp) {
        lines.push("-- " + grp.g + " --");
        grp.items.forEach(function (e, i) {
          var pp = e.paper, meta = [pp.j, pp.a, e.o, pp.d].filter(Boolean).join(" · ");
          lines.push((i + 1) + ". " + e.n);
          if (meta) lines.push("   " + meta);
          lines.push("   " + e.u);
          if (pp.p) lines.push("   https://pubmed.ncbi.nlm.nih.gov/" + pp.p + "/");
          lines.push("");
        });
      });
    });
    return lines.join("\n");
  }
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea"), ok = false;
      ta.value = t; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) res(); else rej();
    });
  }
  function downloadBackup() {
    syncSaved();
    var mod = +lsGet(MK), d = new Date(), pad = function (x) { return (x < 10 ? "0" : "") + x; };
    var data = JSON.stringify({ format: "hog-saved-papers", version: 2, exported: d.toISOString(), count: savedList().length,
      lastChanged: mod ? new Date(mod).toISOString() : "", saved: savedList() }, null, 1);
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    a.download = "saved-items-" + d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "-" + pad(d.getHours()) + pad(d.getMinutes()) + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  function importBackup(file) {
    if (!file) return;
    if (file.size > 4000000) { toast("That file is too large to be a backup of saved items."); return; }
    var rd = new FileReader();
    rd.onerror = function () { toast("Could not read that file."); };
    rd.onload = function () {
      var j, added = 0;
      try {
        j = JSON.parse(String(rd.result || ""));
        if (!j || j.format !== "hog-saved-papers" || !Array.isArray(j.saved)) throw new Error("format");
      } catch (e) { toast("That file is not a saved-items backup."); return; }
      var inc = cleanSaved(j.saved);
      syncSaved();
      Object.keys(inc).forEach(function (k) {
        if (!SAVED[k]) { SAVED[k] = inc[k]; if (!SAVED[k].t) SAVED[k].t = Date.now(); SAVED[k].m = Date.now(); delete DELS[k]; added++; }
      });
      persistSaved(); savedChanged(); if (added) scheduleSync();
      toast(saveWarn ? STORE_WARN : added ? "Restored " + added + " saved item" + (added === 1 ? "" : "s") + "." : "Nothing new to restore: those items are already saved.");
    };
    rd.readAsText(file);
  }
  /* click on Copy list / Download backup / Restore inside a section's Saved row; returns true if it handled the click */
  function savedToolClick(ev, root) {
    var b = ev.target.closest ? ev.target.closest("[data-sv]") : null;
    if (!b) return false;
    var act = b.getAttribute("data-sv");
    if (act === "copy") {
      syncSaved();
      var n = savedList().length;
      copyText(exportText()).then(function () { toast("Copied " + n + " saved item" + (n === 1 ? "" : "s") + " to the clipboard."); },
        function () { toast("Could not copy here. Use Download backup instead."); });
    } else if (act === "dl") {
      downloadBackup(); toast("Backup downloaded.");
    } else if (act === "imp") {
      var f = root.querySelector(".sv-file"); if (f) f.click();
    } else if (act === "syncon") {
      var inp = root.querySelector(".sv-key"), v = inp ? inp.value.trim() : "";
      if (v.length < 16) { toast("That sync key is too short."); return true; }
      lsSet(SYNC_KEYK, v); lsSet(SYNC_SHOWK, "1"); syncErr = "";
      savedChanged(); runSync(true);
    } else if (act === "syncnow") {
      runSync(true);
    } else if (act === "syncoff") {
      lsSet(SYNC_KEYK, null); lsSet(SYNC_LASTK, null); syncErr = "";
      toast("Sync is off on this device. Your saved list stays here."); savedChanged();
    }
    return true;
  }
  function savedFileChange(ev) {
    var f = ev.target.closest ? ev.target.closest(".sv-file") : null;
    if (!f) return;
    importBackup(f.files && f.files[0]);
    try { f.value = ""; } catch (e) {}
  }

  /* ---------- owner-only sync ----------
     The Worker keeps one merged list. Merge rule, per item: the newest change wins, where a change is either the item's
     m (saved) or a removal time in DELS. The same rule runs here and in the Worker, so devices end up identical. */
  function mergeRemote(ritems, rdels) {
    var inc = cleanSaved(ritems), changed = false, rd = {};
    if (rdels && typeof rdels === "object") Object.keys(rdels).slice(0, 5000).forEach(function (k) {
      var v = +rdels[k]; if (v > 0 && /^(papers|digest|guide):.{1,700}$/.test(k)) rd[k] = v;
    });
    Object.keys(rd).forEach(function (k) { if (rd[k] > (DELS[k] || 0)) { DELS[k] = rd[k]; changed = true; } });
    Object.keys(inc).forEach(function (k) {
      if (DELS[k] && inc[k].m <= DELS[k]) return;
      if (!SAVED[k] || inc[k].m > SAVED[k].m) { SAVED[k] = inc[k]; changed = true; }
    });
    Object.keys(DELS).forEach(function (k) { if (SAVED[k] && SAVED[k].m <= DELS[k]) { delete SAVED[k]; changed = true; } });
    var cut = Date.now() - 180 * 864e5;
    Object.keys(DELS).forEach(function (k) { if (DELS[k] < cut) delete DELS[k]; });
    return changed;
  }
  function syncUi() {
    [].forEach.call(document.querySelectorAll(".sv-sync-st"), function (el) { el.textContent = syncStatus(); });
  }
  var syncTimer;
  function scheduleSync() {
    if (!SYNC_URL || !syncKey()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { runSync(false); }, 1500);
  }
  function runSync(manual) {
    var key = syncKey();
    if (!SYNC_URL || !key || typeof fetch !== "function") return;
    if (window.__hogSyncBusy) { window.__hogSyncAgain = true; return; }
    window.__hogSyncBusy = true; window.__hogSyncAt = Date.now(); syncUi();
    syncSaved();
    var body = JSON.stringify({ items: SAVED, dels: DELS });
    fetch(SYNC_URL, { method: "POST", headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" }, body: body })
      .then(function (r) {
        if (r.status === 401) throw new Error("wrong sync key");
        if (!r.ok) throw new Error("the sync service had a problem");
        return r.json();
      })
      .then(function (j) {
        syncSaved();
        var before = Object.keys(SAVED).length, changed = mergeRemote(j && j.items, j && j.dels);
        if (changed) { persistSaved(); savedChanged(); }
        syncErr = ""; lsSet(SYNC_LASTK, String(Date.now()));
        if (manual) toast(changed ? "Synced. Your list was updated from your other devices." : "Synced. Everything is up to date.");
      })
      .catch(function (e) {
        syncErr = e && /sync/.test(String(e.message)) ? e.message : "could not reach the sync service";
        if (manual) toast("Not synced: " + syncErr + ".");
      })
      .then(function () {
        window.__hogSyncBusy = false; syncUi();
        if (window.__hogSyncAgain) { window.__hogSyncAgain = false; scheduleSync(); }
      });
  }
  if (SYNC_URL) {
    if (/#hog-sync\b/.test(location.hash)) lsSet(SYNC_SHOWK, "1");
    if (syncKey()) {
      setTimeout(function () { runSync(false); }, 500);
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible" && Date.now() - (window.__hogSyncAt || 0) > 30000) runSync(false);
      });
    }
  }

  if (!document.getElementById("hog-saved-style")) {
    var SC = ":is(.hor,.hdg,.hog) ";
    var sst = document.createElement("style");
    sst.id = "hog-saved-style";
    sst.textContent = [
      SC + "button.sv{all:unset;cursor:pointer;font:600 13px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:#56656f!important;text-decoration:underline;text-underline-offset:2px}",
      SC + "button.sv[aria-pressed='true']{color:#7a4a00!important;text-decoration:none;background:#fff1d6;border-radius:999px;padding:3px 8px}",
      SC + "button.sv:focus-visible," + SC + "button.sv-btn:focus-visible{outline:3px solid rgba(20,90,117,.45)!important;outline-offset:2px}",
      SC + ".sv-empty{padding:10px 0;color:#56656f;font-size:15px}",
      SC + "h4.sv-g{display:flex;gap:8px;align-items:baseline;font:700 14.5px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:#145a75!important;margin:14px 0 2px!important;padding:0 0 4px!important;border-bottom:1px solid #cfe3ea;text-transform:none!important;letter-spacing:0!important}",
      SC + ".sv-gn{font:600 12.5px/1 'Source Sans 3',system-ui,sans-serif;color:#145a75;background:#e3f1f6;border-radius:999px;padding:3px 7px}",
      SC + ".sv-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 0 6px;margin-top:8px;border-top:1px solid #eef4f6}",
      SC + "button.sv-btn{all:unset;box-sizing:border-box;cursor:pointer;font:600 13.5px/1 'Source Sans 3',system-ui,sans-serif!important;color:#145a75!important;background:#fff!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:8px 11px!important}",
      SC + "button.sv-btn:hover{background:#d6f2fc!important}",
      SC + ".sv-file{display:none!important}",
      SC + ".sv-foot{font-size:13.5px;color:#56656f;line-height:1.5;margin:6px 0}",
      SC + ".sv-sync{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:6px 0}",
      SC + ".sv-lab{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:14px;color:#56656f}",
      SC + "input.sv-key{box-sizing:border-box;font:600 14px/1.2 'Source Sans 3',system-ui,sans-serif;padding:8px 10px;border:1px solid #9cc9d8;border-radius:8px;min-width:200px;max-width:100%;color:#1b2b34;background:#fff}",
      SC + ".sv-sync-st{font-size:14px;color:#56656f}",
      SC + "button.sv.rm{color:#9b2c2c!important;text-decoration:underline;background:none;padding:0;border-radius:0}",
      "#hor-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(16px);max-width:min(92vw,420px);box-sizing:border-box;background:#145a75;color:#fff;font:600 14.5px/1.35 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;padding:10px 16px;border-radius:10px;box-shadow:0 4px 18px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:2147483000;text-align:center}",
      "#hor-toast.on{opacity:1;transform:translateX(-50%)}",
      "#hor-toast.act{pointer-events:auto}",
      "#hor-toast button{all:unset;cursor:pointer;margin-left:14px;font:700 14.5px/1 'Source Sans 3',system-ui,sans-serif;color:#ffd54a;text-decoration:underline;text-underline-offset:2px}",
      "#hor-toast button:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}",
      "@media (prefers-reduced-motion:reduce){#hor-toast{transition:none}}"
    ].join("\n");
    document.head.appendChild(sst);
  }
  SAVED = readStore() || {};
  window.addEventListener("hog-saved", function () { syncSaved(); applySaved(); });
  window.addEventListener("storage", function (e) { if (e.key === SK) savedChanged(); });
  /* ===== end of saved core ===== */

  function paperHTML(it, q) {
    var pp = it.paper, meta = [pp.j, pp.a].filter(Boolean).join(". ");
    var rid = pp.p ? "pm" + pp.p : "u" + it.u;
    var links = '<div class="lk">' + (pp.p ? '<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(pp.p) + '/" target="_blank" rel="noopener">PubMed</a> ' : "") +
      '<button class="rd" type="button">' + (isRead(rid) ? "\u2713 Opened" : "Mark as opened") + "</button> " + saveBtnHTML(makeSid("papers", pp.p, it.u), "Save this paper") + "</div>";
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
      (key === "papers" && data.papersBuilt ? '<p class="hog-foot">Updated daily from PubMed and the journals\u2019 own feeds; last update ' + esc(data.papersBuilt) + '. Newest first. Your \u201cOpened\u201d marks and saved papers are private and stay on this device.</p>' : "") +
      (key === "calc" ? '<p class="hog-foot">Missing a calculator or found an error? <a href="mailto:' + MAIL + '?subject=Calculators%20section">Send a suggestion</a>.</p>' : "") + "</div>";
    var root = el.firstChild, state = { q: "" };

    /* paper lookups used when a paper is starred, and the feed order used to order the topic groups */
    var byRid = {}, firstFeed = {}, titleByKey = {};
    panels.forEach(function (p) {
      titleByKey[p.key] = p.title;
      p.items.forEach(function (it) {
        if (!it.paper) return;
        var r = it.paper.p ? "pm" + it.paper.p : "u" + it.u;
        byRid[r] = it;
        if (!firstFeed[r]) firstFeed[r] = p.title;
      });
    });
    var feedOrder = panels.map(function (p) { return p.title; });

    /* the "Saved papers" row is built from the reader's own saved list and sits above the feeds (papers section only);
       papers saved before topic groups existed are filed under the feed they are still listed in */
    function savedPanel() {
      var list = savedList("papers").map(function (e) {
        if (e.g) return e;
        var r = e.paper.p ? "pm" + e.paper.p : "u" + e.u, c = {}, k;
        for (k in e) c[k] = e[k];
        c.g = firstFeed[r] || "";
        return c;
      });
      return { key: "saved", title: "★ Saved papers", sub: "Papers you starred, grouped by topic; kept on this device only", fresh: 0, saved: true, items: list };
    }
    function panelHTML(p, q, items, isOpen) {
      var body;
      if (p.saved) {
        body = items.length ? savedGroupsHTML(items, feedOrder, function (it, i) { return rowHTML(it, q, key + "-saved", i); }, "hog-list")
          : (q ? "" : '<p class="sv-empty">Nothing saved yet. Tap ☆ Save under any paper to keep it here, grouped by topic, even after it drops off the feed.</p>');
        if (!q) body += savedToolsHTML();
      } else {
        body = '<ol class="hog-list">' + items.map(function (it, i) { return rowHTML(it, q, key + "-" + p.key, i); }).join("") + "</ol>" +
          (p.home ? '<p class="more">More at <a href="' + esc(p.home[1]) + '" target="_blank" rel="noopener">' + esc(p.home[0]) + "</a></p>" : "");
      }
      return '<div class="hog-item' + (isOpen ? " open" : "") + '" data-k="' + esc(p.key) + '">' +
        '<button class="hog-t" type="button" aria-expanded="' + isOpen + '"><span class="nm">' + esc(p.title) + "</span>" +
        '<span class="rt">' + (p.fresh && !q ? '<span class="badge">' + p.fresh + " new</span>" : "") + "<span>" + (q ? items.length + " of " + p.items.length : p.items.length) + '</span><span class="pm" aria-hidden="true">' + (isOpen ? "–" : "+") + "</span></span>" +
        '<span class="sb">' + esc(p.sub) + "</span></button>" +
        '<div class="hog-c">' + body + "</div></div>";
    }

    function render() {
      var q = norm(state.q.trim()), acc = root.querySelector(".hog-acc"), open = {}, html = "", hits = 0, svHits = 0;
      acc.querySelectorAll(".hog-item.open").forEach(function (n) { open[n.getAttribute("data-k")] = 1; });
      var all = key === "papers" ? [savedPanel()].concat(panels) : panels;
      all.forEach(function (p) {
        var items = p.items.filter(function (it) { return !q || norm([it.n, it.x, it.note, it.paper ? it.paper.j + " " + it.paper.a : domain(it.u), p.title, it.g].join(" ")).indexOf(q) >= 0; });
        if (q && !items.length) return;
        if (p.saved) svHits += items.length; else hits += items.length;
        html += panelHTML(p, q, items, q ? true : !!open[p.key]);
      });
      acc.innerHTML = html || '<p class="hog-empty">Nothing matches “' + esc(state.q) + '”.</p>';
      var s = root.querySelector(".hog-status");
      if (s) s.textContent = q ? hits + (hits === 1 ? " match" : " matches") + (svHits ? " · " + svHits + " in Saved papers" : "") : "";
    }

    /* after a save or unsave: redraw only the Saved papers row (or the whole result list while searching) */
    function refreshSaved() {
      if (key !== "papers") return;
      if (state.q) { render(); return; }
      var item = root.querySelector('.hog-item[data-k="saved"]');
      if (!item) { render(); return; }
      var p = savedPanel(), tmp = document.createElement("div");
      tmp.innerHTML = panelHTML(p, "", p.items, item.classList.contains("open"));
      item.parentNode.replaceChild(tmp.firstChild, item);
    }
    function onSave(btn, li) {
      var sidv = btn.getAttribute("data-sid"), snap = SAVED[sidv], rid = li.getAttribute("data-rid");
      if (!snap) {
        var it = byRid[rid];
        if (!it) return;
        var pane = btn.closest(".hog-item"), pk = pane ? pane.getAttribute("data-k") : "";
        snap = { s: "papers", g: titleByKey[pk] || firstFeed[rid] || "", n: it.n, u: it.u, t: Date.now(), paper: it.paper };
      }
      saveToast(toggleSaveEntry(snap), "Saved papers", snap);
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
      var rli = ev.target.closest("li[data-rid]");
      if (rli && ev.target.closest("button.rd")) { setRead(rli.getAttribute("data-rid"), !isRead(rli.getAttribute("data-rid"))); return; }
      if (rli && ev.target.closest("button.sv")) { onSave(ev.target.closest("button.sv"), rli); return; }
      if (savedToolClick(ev, root)) return;
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
    root.addEventListener("change", savedFileChange);
    if (key === "papers") window.addEventListener("hog-saved", refreshSaved);

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
