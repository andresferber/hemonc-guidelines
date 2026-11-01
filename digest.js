/* Weekly digest for andresferber.org (Page ONE), in the Page ONE design.
   Usage:
     <div id="hemonc-digest"></div>
     <script src="https://andresferber.github.io/hemonc-guidelines/digest.js"></script>
   Reads digest/index.json and digest/<week>.json (built every Monday on GitHub by
   tools/build_digest.py). Summaries are the authors' own conclusions from the abstract. */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, "") : "";
  var bust = "?v=" + Math.floor(Date.now() / 600000);
  var mount = document.getElementById("hemonc-digest");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "hemonc-digest";
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
    ".hdg{container-type:inline-size;--sky:#a9e4f8;--sky2:#d6f2fc;--ink:#1f2a33;--muted:#56656f;--deep:#145a75;--rule:#cfe3ea;--paper:#fff;--new:#9a5a00;--newbg:#fff1d6;",
    "font:400 16px/1.5 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);text-align:left;display:flex;flex-direction:column;gap:12px;font-variant-numeric:tabular-nums}",
    ".hdg *{box-sizing:border-box}",
    ".hdg p{margin:0!important;padding:0!important}",
    ".hdg a{color:var(--deep)!important;text-decoration:underline!important;text-underline-offset:2px;text-decoration-thickness:1px}",
    ".hdg button{font-family:inherit}",
    ".hdg button.b{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font:600 14px/1 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;background:var(--paper)!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:10px 12px!important;height:auto!important;text-transform:none!important;box-shadow:none!important;white-space:nowrap}",
    ".hdg button.b:hover{background:var(--sky2)!important}",
    ".hdg button.b:disabled{opacity:.4;cursor:default}",
    ".hdg button.b.solid{background:var(--deep)!important;color:#fff!important;border-color:var(--deep)!important}",
    ".hdg button.b.solid:hover{background:#0f4a61!important}",
    ".hdg button:focus-visible,.hdg select:focus-visible,.hdg input:focus-visible{outline:3px solid rgba(20,90,117,.45)!important;outline-offset:2px}",
    /* week navigation */
    ".hdg .wk{display:flex;align-items:center;gap:8px}",
    ".hdg .wk select{all:unset;box-sizing:border-box;flex:1 1 auto;min-width:0;cursor:pointer;font:700 16px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important;background:var(--paper) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20'%3E%3Cpath d='M5 7.5l5 5 5-5' fill='none' stroke='%23145a75' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 12px center!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:10px 32px 10px 12px!important;height:auto!important;text-align:center}",
    ".hdg .wk button.b{padding:10px 11px!important}",
    ".hdg .sum{font-size:14.5px;color:var(--muted);text-align:center}",
    ".hdg .q{all:unset;box-sizing:border-box;display:block;width:100%;font:400 16px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important;background:var(--paper)!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:10px 14px!important;height:auto!important}",
    /* accordion */
    ".hdg .acc{display:flex;flex-direction:column}",
    ".hdg .it{border:1px solid #8fbccb;margin-top:-1px;background:var(--paper)}",
    ".hdg .it:first-child{border-radius:8px 8px 0 0}.hdg .it:last-child{border-radius:0 0 8px 8px}",
    ".hdg button.t{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:center;width:100%;padding:12px 16px!important;background:var(--sky)!important;color:var(--ink)!important;height:auto!important;text-transform:none!important;box-shadow:none!important}",
    ".hdg .it:first-child button.t{border-radius:7px 7px 0 0}.hdg .it:last-child:not(.open) button.t{border-radius:0 0 7px 7px}",
    ".hdg button.t:hover{background:#97dcf4!important}",
    ".hdg .it.open > button.t{background:#76cae9!important}",
    ".hdg .t .nm{font:700 16.5px/1.25 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important}",
    ".hdg .t .sb{grid-column:1;font-size:14px;color:#2f4a55;line-height:1.3}",
    ".hdg .t .rt{grid-row:1/span 2;grid-column:2;display:flex;gap:8px;align-items:center;font-size:14px;color:#2f4a55;white-space:nowrap}",
    ".hdg .t .pm{font:400 22px/1 'Source Sans 3',system-ui,sans-serif;width:18px;text-align:center;color:var(--deep)}",
    ".hdg .badge{display:inline-block;font:600 12.5px/1 'Source Sans 3',system-ui,sans-serif;padding:4px 7px;border-radius:999px;background:#e3f1f6;color:var(--deep)!important;white-space:nowrap}",
    ".hdg .badge.key{background:var(--newbg);color:var(--new)!important}",
    ".hdg .badge.ol{background:#eef0f1;color:#5d676d!important}",
    ".hdg .c{display:none;padding:10px 16px 14px}",
    ".hdg .it.open > .c{display:block}",
    ".hdg .tools{display:flex;justify-content:flex-start;margin-bottom:4px}",
    ".hdg h4.sh{font:700 14.5px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;margin:12px 0 2px!important;padding:0 0 4px!important;border-bottom:1px solid var(--rule);text-transform:none!important;letter-spacing:0!important}",
    ".hdg ol.l{margin:0!important;padding:0!important;list-style:none!important}",
    ".hdg ol.l > li{display:block!important;list-style:none!important;background:none!important;margin:0!important;padding:12px 0!important;border-bottom:1px solid #eef4f6;text-indent:0!important}",
    ".hdg ol.l > li:last-child{border-bottom:0}",
    ".hdg ol.l > li.playing{background:#fffbe9!important;box-shadow:-8px 0 0 #fffbe9,-12px 0 0 #e0a800}",
    ".hdg .ti{font-weight:600;font-size:16px;line-height:1.35;overflow-wrap:anywhere}",
    ".hdg .ti a{color:var(--ink)!important;text-decoration-color:#9cc9d8!important}",
    ".hdg .ti a:hover{color:var(--deep)!important}",
    ".hdg .meta{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center;font-size:14px;color:var(--muted);margin-top:3px}",
    ".hdg .cc{margin-top:6px;font-size:15px;color:#33434c;line-height:1.5}",
    ".hdg .cc b{color:var(--ink);font-weight:600}",
    ".hdg details.ab{margin-top:6px;font-size:14.5px}",
    ".hdg details.ab summary{cursor:pointer;color:var(--deep);font-weight:600;list-style:revert!important}",
    ".hdg details.ab p{margin:6px 0 0!important;color:#33434c}",
    ".hdg details.ab p b{color:var(--ink)}",
    ".hdg .lk{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center;font-size:14px;margin-top:6px}",
    ".hdg .lk .free{color:#1d6b3d!important}",
    ".hdg button.ls{all:unset;cursor:pointer;color:var(--deep)!important;font:600 14px/1.2 'Source Sans 3',system-ui,sans-serif!important;text-decoration:underline;text-underline-offset:2px}",
    ".hdg li.isread .gn a, .hdg li.isread .ti a{color:#7a6f8f!important;font-weight:600}",
    ".hdg li.isread{opacity:.92}",
    ".hdg button.rd{all:unset;cursor:pointer;font:600 13px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:#56656f!important;text-decoration:underline;text-underline-offset:2px}",
    ".hdg li.isread button.rd{color:#5b3e96!important;text-decoration:none;background:#f1ecfa;border-radius:999px;padding:3px 8px}",
    ".hdg button.hd{all:unset;cursor:pointer;font:600 13px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:#145a75!important;background:#e3f1f6;border-radius:999px;padding:3px 8px}",
    ".hdg button.hd[hidden]{display:none!important}",
    ".hdg li.isheard .ti a{color:#4f6f7c!important}",
    ".hdg .empty{color:var(--muted);font-size:15px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}",
    ".hdg .wnote{font-size:13.5px;color:var(--muted)}",
    ".hdg .auto{display:flex;align-items:center;gap:10px;font-size:15px;color:var(--ink)}",
    ".hdg button.sw{all:unset;box-sizing:border-box;flex:none;cursor:pointer;width:46px;height:26px;border-radius:13px;background:#c4dbe3!important;position:relative;transition:background .2s}",
    ".hdg button.sw::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .2s}",
    ".hdg button.sw[aria-checked='true']{background:var(--deep)!important}",
    ".hdg button.sw[aria-checked='true']::after{left:23px}",
    ".hdg .auto label{cursor:pointer}",
    ".hdg .foot{font-size:13.5px;color:var(--muted);line-height:1.5}",
    ".hdg mark{background:#fff0a8;color:inherit;padding:0 1px}",
    "@container (max-width:460px){.hdg button.t{padding:10px 12px!important}.hdg .c{padding:8px 12px 12px}}",
    "@media (max-width:560px){.hdg .t .sb{display:none}}",
    /* listening bar */
    ".hdg-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9998;display:flex;align-items:center;gap:6px;max-width:calc(100vw - 24px);width:660px;background:#145a75;color:#fff;border-radius:12px;padding:8px;box-shadow:0 10px 30px -8px rgba(10,30,45,.55);font:400 15px/1.3 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;text-align:left}",
    ".hdg-bar[hidden]{display:none}",
    ".hdg-bar .lab{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:0 6px}",
    ".hdg-bar .pos{font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".hdg-bar .ttl{font-size:13.5px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".hdg-bar button{all:unset;box-sizing:border-box;cursor:pointer;flex:none;font:600 14.5px/1 'Source Sans 3',system-ui,sans-serif!important;color:#145a75!important;background:#fff!important;border-radius:8px;padding:10px 12px!important;white-space:nowrap}",
    ".hdg-bar button[hidden]{display:none!important}",
    ".hdg-bar button:hover{background:#d6f2fc!important}",
    ".hdg-bar button:disabled{opacity:.45;cursor:default}",
    ".hdg-bar button.ghost{background:transparent!important;color:#fff!important;border:1px solid rgba(255,255,255,.5)}",
    ".hdg-bar button.ghost:hover{background:rgba(255,255,255,.15)!important}",
    ".hdg-bar button.au[aria-pressed='true']{background:#ffd54a!important;color:#1f2a33!important;border-color:#ffd54a}",
    ".hdg-bar button:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}",
    "@media (max-width:560px){.hdg-bar{flex-wrap:wrap;row-gap:8px}.hdg-bar .lab{order:-1;flex-basis:100%}.hdg-bar .ttl{display:none}.hdg-bar button{flex:1 1 auto;padding:12px 8px!important;text-align:center;justify-content:center}.hdg-bar .spd{display:none}}"
  ].join("\n");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function hil(text, q) {
    var raw = String(text || ""), i = q ? norm(raw).indexOf(q) : -1;
    if (i < 0) return esc(raw);
    return esc(raw.slice(0, i)) + "<mark>" + esc(raw.slice(i, i + q.length)) + "</mark>" + esc(raw.slice(i + q.length));
  }
  function d8(s) { var m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function short(s) { var d = d8(s); return d ? MON[d.getMonth()] + " " + d.getDate() : ""; }
  function weekLabel(w, end) {
    var a = d8(w), b = d8(end);
    if (!a || !b) return w;
    return "Week of " + MON[a.getMonth()] + " " + a.getDate() + "–" + (a.getMonth() === b.getMonth() ? "" : MON[b.getMonth()] + " ") + b.getDate() + ", " + b.getFullYear();
  }
  function getJSON(u) { return fetch(base + u + bust).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }

  var INDEX = null, CACHE = {}, state = { wi: 0, q: "", open: {} };
  var canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  mount.innerHTML = '<div class="hdg"><p class="sum">Loading the weekly digest…</p></div>';
  var root = mount.firstChild;

  getJSON("digest/index.json").then(function (ix) {
    INDEX = ix;
    if (!ix.weeks.length) { root.innerHTML = '<p class="sum">The first digest will appear after the next Monday update.</p>'; return; }
    root.innerHTML =
      '<div class="wk"><button class="b prev" type="button" aria-label="Previous week">‹</button>' +
      '<select aria-label="Choose a week">' + ix.weeks.map(function (w, i) { return '<option value="' + i + '">' + esc(weekLabel(w.week, w.end)) + "</option>"; }).join("") + "</select>" +
      '<button class="b next" type="button" aria-label="Next week">›</button></div>' +
      '<p class="sum" aria-live="polite"></p>' +
      '<input class="q" type="search" placeholder="Search this week’s papers" aria-label="Search this week’s papers">' +
      (canSpeak ? '<div class="auto"><button class="sw" type="button" role="switch" id="hdg-auto" aria-checked="false"></button>' +
        '<label for="hdg-auto">Play the next paper automatically (continues into the next topic)</label></div>' : "") +
      '' +
      '<div class="acc"></div>' +
      '<p class="foot">New papers added to PubMed each week (Monday to Sunday), updated every Monday. Summaries are the authors’ own conclusions, or the final sentences of the abstract when it has no conclusion section; they are not AI-written. Study labels on very recent papers are inferred from the title and methods.</p>';
    loadWeek(0);
    setAuto(P.auto);
  }).catch(function () { root.innerHTML = '<p class="sum">The digest could not be loaded. Please reload the page.</p>'; });

  function loadWeek(i) {
    state.wi = i;
    var w = INDEX.weeks[i];
    root.querySelector("select").value = String(i);
    root.querySelector(".prev").disabled = i >= INDEX.weeks.length - 1;
    root.querySelector(".next").disabled = i <= 0;
    var p = CACHE[w.week] ? Promise.resolve(CACHE[w.week]) : getJSON("digest/" + w.week + ".json").then(function (d) { CACHE[w.week] = d; return d; });
    p.then(function (d) { if (state.wi === i) render(d); })
     .catch(function () { root.querySelector(".acc").innerHTML = '<p class="sum">This week could not be loaded.</p>'; });
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
  /* "listened" marks: same privacy as "opened" (this browser only), set when a paper has been read aloud to the end */
  var HK = "hogHeard";
  function heardMap() { try { return JSON.parse(localStorage.getItem(HK) || "{}") || {}; } catch (e) { return {}; } }
  function isHeard(id) { return !!(id && heardMap()[id]); }
  function setHeard(id, on) {
    if (!id) return;
    var m = heardMap(), now = Date.now();
    if (on) m[id] = now; else delete m[id];
    for (var k in m) if (now - m[k] > 365 * 864e5) delete m[k];
    try { localStorage.setItem(HK, JSON.stringify(m)); } catch (e) {}
    applyRead();
  }
  function applyRead() {
    var hm = heardMap();
    [].forEach.call(document.querySelectorAll("li[data-rid]"), function (li) {
      var on = !!hm[li.getAttribute("data-rid")], b = li.querySelector("button.hd");
      li.classList.toggle("isheard", on);
      if (b) b.hidden = !on;
    });
    var m = readMap();
    [].forEach.call(document.querySelectorAll("li[data-rid]"), function (li) {
      var on = !!m[li.getAttribute("data-rid")];
      li.classList.toggle("isread", on);
      var b = li.querySelector("button.rd");
      if (b) { b.textContent = on ? "✓ Opened" : "Mark as opened"; b.setAttribute("aria-pressed", on ? "true" : "false"); }
    });
  }
  window.addEventListener("storage", function (e) { if (e.key === RK || e.key === HK) applyRead(); });
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

  /* ---------- Saved papers row of the weekly digest ---------- */
  var svN = 0;
  function savedRowHTML(e, q) {
    var pp = e.paper, rid = pp.p ? "pm" + pp.p : "u" + e.u, sidv = makeSid("digest", pp.p, e.u);
    var cls = (isRead(rid) ? "isread " : "") + (isHeard(rid) ? "isheard" : "");
    return '<li data-rid="' + esc(rid) + '"' + (cls.trim() ? ' class="' + cls.trim() + '"' : "") + '><div class="ti"><a href="' + esc(e.u) + '" target="_blank" rel="noopener">' + hil(e.n, q) + "</a></div>" +
      '<div class="meta"><span>' + esc(short(pp.d)) + "</span><span>" + hil(pp.j, q) + (pp.a ? ". " + hil(pp.a, q) : "") + "</span>" +
      (pp.ty ? '<span class="badge' + (pp.ty === "Letter" || pp.ty === "Case report" ? " ol" : "") + '">' + esc(pp.ty) + "</span>" : "") + "</div>" +
      (e.x ? '<p class="cc"><b>' + esc(e.xl || "Summary") + ":</b> " + hil(e.x, q) + "</p>" : "") +
      '<div class="lk">' + (pp.p ? '<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(pp.p) + '/" target="_blank" rel="noopener">PubMed</a>' : "") +
      '<button class="rd" type="button">' + (isRead(rid) ? "✓ Opened" : "Mark as opened") + "</button>" +
      saveBtnHTML(sidv, "Save this paper") + "</div></li>";
  }
  function savedItemHTML(q, order) {
    var all = savedList("digest"), items = all.filter(function (e) {
      return !q || norm([e.n, e.paper.j, e.paper.a, e.x, e.paper.ty, e.g].join(" ")).indexOf(q) >= 0;
    });
    svN = items.length;
    if (q && !items.length) return "";
    var isOpen = q ? true : !!state.open.saved;
    var body = items.length ? savedGroupsHTML(items, order, function (e) { return savedRowHTML(e, q); }, "l")
      : (q ? "" : '<p class="sv-empty">Nothing saved yet. Tap ☆ Save under any paper to keep it here, grouped by topic, even after its week has passed.</p>');
    if (!q) body += savedToolsHTML();
    return '<div class="it' + (isOpen ? " open" : "") + '" data-t="saved"><button class="t" type="button" aria-expanded="' + isOpen + '"><span class="nm">★ Saved papers</span>' +
      '<span class="rt"><span>' + (q ? items.length + " of " + all.length : all.length) + '</span><span class="pm" aria-hidden="true">' + (isOpen ? "–" : "+") + "</span></span>" +
      '<span class="sb">From the weekly digest, grouped by topic; kept on this device only</span></button><div class="c">' + body + "</div></div>";
  }
  function weekTopicTitles() {
    var w = INDEX && INDEX.weeks[state.wi], d = w && CACHE[w.week];
    return d ? d.topics.map(function (t) { return t.title; }) : [];
  }
  /* after a save or unsave: redraw only the Saved row (the whole week while searching) */
  function refreshSaved() {
    if (!INDEX) return;
    var acc = root.querySelector(".acc");
    if (!acc) return;
    if (state.q) { var w = INDEX.weeks[state.wi]; if (CACHE[w.week]) render(CACHE[w.week]); return; }
    var item = acc.querySelector('.it[data-t="saved"]'), tmp = document.createElement("div");
    tmp.innerHTML = savedItemHTML("", weekTopicTitles());
    if (!tmp.firstChild) return;
    if (item) item.parentNode.replaceChild(tmp.firstChild, item); else acc.insertBefore(tmp.firstChild, acc.firstChild);
  }
  function onSave(btn) {
    var sidv = btn.getAttribute("data-sid"), snap = SAVED[sidv], li = btn.closest("li");
    if (!snap) {
      var k = (li && li.getAttribute("data-k") || "").split(":"), p = LISTS[k[0]] && LISTS[k[0]][+k[1]];
      if (!p) return;
      snap = { s: "digest", g: TITLES[k[0]] || "", n: p.t, u: p.doi ? "https://doi.org/" + p.doi : "https://pubmed.ncbi.nlm.nih.gov/" + p.p + "/",
        t: Date.now(), x: p.c || "", xl: p.cl || "", paper: { p: p.p, j: p.j, a: p.a, d: p.d, ty: p.ty } };
    }
    saveToast(toggleSaveEntry(snap), "Saved papers", snap);
  }
  window.addEventListener("hog-saved", refreshSaved);

  function paperHTML(p, tk, idx, q, note) {
    var url = p.doi ? "https://doi.org/" + p.doi : "https://pubmed.ncbi.nlm.nih.gov/" + p.p + "/";
    var meta = '<span>' + esc(short(p.d)) + "</span><span>" + hil(p.j, q) + (p.a ? ". " + hil(p.a, q) : "") + "</span>" +
      (p.ty ? '<span class="badge' + (p.key ? " key" : p.ty === "Letter" || p.ty === "Case report" ? " ol" : "") + '">' + esc(p.ty) + "</span>" : "");
    var cc = p.c ? '<p class="cc"><b>' + esc(p.cl) + ":</b> " + hil(p.c, q) + "</p>" : '<p class="cc wnote">No abstract in PubMed yet.</p>';
    var ab = p.ab && p.ab.length ? '<details class="ab"><summary>Full abstract</summary>' + p.ab.map(function (s) { return "<p>" + (s[0] ? "<b>" + esc(s[0]) + ":</b> " : "") + hil(s[1], q) + "</p>"; }).join("") + "</details>" : "";
    var links = '<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(p.p) + '/" target="_blank" rel="noopener">PubMed</a>' +
      (p.free && p.pmc ? '<a class="free" href="https://pmc.ncbi.nlm.nih.gov/articles/' + esc(p.pmc) + '/" target="_blank" rel="noopener">Free full text</a>' : "") +
      (canSpeak && p.c ? '<button class="ls" type="button" data-play="' + esc(tk) + ":" + idx + '">▶ Listen</button>' : "") +
      (canSpeak && p.ab && p.ab.length ? '<button class="ls" type="button" data-full="1" data-play="' + esc(tk) + ":" + idx + '">▶ Listen to full abstract</button>' : "") +
      '<button class="rd" type="button">' + (isRead("pm" + p.p) ? "\u2713 Opened" : "Mark as opened") + "</button>" +
      saveBtnHTML(makeSid("digest", p.p, url), "Save this paper") + '<button class="hd" type="button" title="Tap to remove"' + (isHeard("pm" + p.p) ? "" : " hidden") + '>\u2713 Listened</button>';
    return '<li data-k="' + esc(tk) + ":" + idx + '" data-rid="pm' + esc(p.p) + '"' + (isRead("pm" + p.p) || isHeard("pm" + p.p) ? ' class="' + (isRead("pm" + p.p) ? "isread " : "") + (isHeard("pm" + p.p) ? "isheard" : "") + '"' : "") + ">" + (note ? '<div class="wnote">' + esc(note) + "</div>" : "") +
      '<div class="ti"><a href="' + esc(url) + '" target="_blank" rel="noopener">' + hil(p.t, q) + "</a></div>" +
      '<div class="meta">' + meta + "</div>" + cc + ab + '<div class="lk">' + links + "</div></li>";
  }

  var LISTS = {}, TITLES = {}, ORDER = [];  // topic key -> papers currently shown (for the player)

  function render(d) {
    var q = norm(state.q.trim()), total = 0, keys = 0, html = "";
    LISTS = {}; ORDER = []; TITLES = {};
    var svHtml = savedItemHTML(q, d.topics.map(function (t) { return t.title; }));
    d.topics.forEach(function (t) {
      ORDER.push(t.key); TITLES[t.key] = t.title;
      var ps = t.papers.filter(function (p) { return !q || norm([p.t, p.j, p.a, p.c, p.ty].join(" ")).indexOf(q) >= 0; });
      LISTS[t.key] = ps;
      total += ps.length;
      var nk = ps.filter(function (p) { return p.key; }).length;
      keys += nk;
      if (q && !ps.length) return;
      var open = q ? ps.length > 0 : !!state.open[t.key];
      var body;
      if (!ps.length) {
        body = '<div class="empty"><span>No new papers on this topic this week.</span><button class="b earlier" type="button" data-topic="' + esc(t.key) + '">Show the most recent papers</button></div>';
      } else {
        var kp = ps.filter(function (p) { return p.key; }), op = ps.filter(function (p) { return !p.key; });
        var list = function (arr) { return '<ol class="l">' + arr.map(function (p) { return paperHTML(p, t.key, ps.indexOf(p), q); }).join("") + "</ol>"; };
        body = (canSpeak && ps.some(function (p) { return p.c; }) ? '<div class="tools"><button class="b solid listen" type="button" data-topic="' + esc(t.key) + '">▶ Listen to this topic</button></div>' : "") +
          (kp.length && op.length ? '<h4 class="sh">Trials, meta-analyses and guidelines</h4>' + list(kp) + '<h4 class="sh">Other papers</h4>' + list(op) : list(ps));
      }
      html += '<div class="it' + (open ? " open" : "") + '" data-t="' + esc(t.key) + '">' +
        '<button class="t" type="button" aria-expanded="' + open + '"><span class="nm">' + esc(t.title) + "</span>" +
        '<span class="rt">' + (nk ? '<span class="badge key">' + nk + (nk === 1 ? " key study" : " key studies") + "</span>" : "") + "<span>" + ps.length + '</span><span class="pm" aria-hidden="true">' + (open ? "–" : "+") + "</span></span>" +
        '<span class="sb">' + esc(t.sub) + "</span></button>" +
        '<div class="c">' + body + "</div></div>";
    });
    root.querySelector(".acc").innerHTML = (svHtml + html) || '<p class="sum">Nothing this week matches “' + esc(state.q) + '”.</p>';
    root.querySelector(".sum").textContent = q
      ? total + (total === 1 ? " match" : " matches") + " this week" + (svN ? " \u00b7 " + svN + " in Saved papers" : "")
      : total + " new papers" + (keys ? ", " + keys + (keys === 1 ? " trial, meta-analysis or guideline" : " trials, meta-analyses or guidelines") : "");
    markPlaying();
  }

  /* earlier papers for a topic with nothing this week */
  function showEarlier(tk, btn) {
    btn.disabled = true; btn.textContent = "Loading…";
    var found = [], i = state.wi + 1;
    function next() {
      if (found.length >= 5 || i >= INDEX.weeks.length || i > state.wi + 12) return done();
      var w = INDEX.weeks[i++];
      if (!w.counts[tk]) return next();
      (CACHE[w.week] ? Promise.resolve(CACHE[w.week]) : getJSON("digest/" + w.week + ".json").then(function (d) { CACHE[w.week] = d; return d; }))
        .then(function (d) {
          d.topics.forEach(function (t) { if (t.key === tk) t.papers.forEach(function (p) { found.push({ p: p, w: d }); }); });
          next();
        }).catch(next);
    }
    function done() {
      var box = btn.closest(".c");
      if (!found.length) { btn.parentNode.innerHTML = "<span>No papers on this topic in recent weeks.</span>"; return; }
      found = found.slice(0, 5);
      LISTS[tk] = found.map(function (f) { return f.p; });
      box.innerHTML = '<p class="wnote">No new papers this week. The most recent ones:</p>' +
        (canSpeak ? '<div class="tools" style="margin-top:8px"><button class="b solid listen" type="button" data-topic="' + esc(tk) + '">▶ Listen to these</button></div>' : "") +
        '<ol class="l">' + found.map(function (f, k) { return paperHTML(f.p, tk, k, "", weekLabel(f.w.week, f.w.end)); }).join("") + "</ol>";
    }
    next();
  }

  /* ---------- listening ---------- */
  var bar = document.createElement("div");
  bar.className = "hdg-bar"; bar.hidden = true;
  bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Digest audio");
  bar.innerHTML = '<button type="button" class="pv" aria-label="Previous paper">‹</button>' +
    '<div class="lab"><span class="pos"></span><span class="ttl"></span></div>' +
    '<button type="button" class="nx" aria-label="Next paper">›</button>' +
    '<button type="button" class="ps">Pause</button>' +
    '<button type="button" class="ghost spd" aria-label="Reading speed">1×</button>' +
    '<button type="button" class="ghost fa" aria-label="Read the full abstract of this paper">Full abstract</button>' +
    '<button type="button" class="ghost au" aria-pressed="false" aria-label="Play the next paper automatically">Auto</button>' +
    '<button type="button" class="ghost x" aria-label="Stop listening">✕</button>';
  /* attach to <html>, outside Weebly's phone-layout page wrapper, which moves anything in <body>
     into a transformed container and so breaks position:fixed; put it back if anything moves it */
  (function pin(el) {
    document.documentElement.appendChild(el);
    if (window.MutationObserver) new MutationObserver(function () {
      if (el.parentNode !== document.documentElement) document.documentElement.appendChild(el);
    }).observe(document.body, { childList: true, subtree: true });
  })(bar);
  var P = { list: [], i: -1, tk: "", paused: false, done: false, end: false, rate: 1, gen: 0, auto: false, lock: null };
  try { P.auto = localStorage.getItem("hdgAuto") === "1"; } catch (e) {}
  function setAuto(on) {
    P.auto = !!on;
    try { localStorage.setItem("hdgAuto", P.auto ? "1" : "0"); } catch (e) {}
    var sw = mount.querySelector("#hdg-auto");
    if (sw) sw.setAttribute("aria-checked", P.auto ? "true" : "false");
    bar.querySelector(".au").setAttribute("aria-pressed", P.auto ? "true" : "false");
    bar.querySelector(".au").textContent = P.auto ? "Auto on" : "Auto";
    keepAwake(P.auto && P.i >= 0);
  }
  /* keep the phone screen on while playing automatically, so the browser keeps speaking */
  function keepAwake(on) {
    if (!("wakeLock" in navigator)) return;
    if (on && !P.lock) navigator.wakeLock.request("screen").then(function (l) { P.lock = l; l.addEventListener("release", function () { P.lock = null; }); }).catch(function () {});
    if (!on && P.lock) { P.lock.release().catch(function () {}); P.lock = null; }
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden && P.auto && P.i >= 0) keepAwake(true); });
  var RATES = [1, 1.15, 1.3, 1.5, 0.9];

  function voice() {
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    var pref = [/natural/i, /neural/i, /premium|enhanced/i, /google us english/i, /samantha/i, /aria|jenny|guy/i, /google uk english/i, /daniel|karen|moira|tessa/i];
    for (var k = 0; k < pref.length; k++) { var v = vs.filter(function (x) { return pref[k].test(x.name); })[0]; if (v) return v; }
    return vs.filter(function (x) { return /en-US/i.test(x.lang); })[0] || vs[0] || null;
  }
  function spoken(p) {
    var t = p.t.replace(/\s*\[[^\]]*\]\s*/g, " ") + ". " + (p.cl === "Abstract" ? "" : (p.cl.indexOf("Authors") === 0 ? "Authors' conclusion. " : "From the abstract. ")) + p.c;
    return t.replace(/\bvs\.?\s/gi, "versus ").replace(/\bpts\b/gi, "patients").replace(/(\d)\s*%/g, "$1 percent").replace(/\s+/g, " ");
  }
  function hasFull(p) { return !!(p.ab && p.ab.length); }
  function spokenFull(p) {
    var t = p.t.replace(/\s*\[[^\]]*\]\s*/g, " ") + ". Full abstract. " +
      (hasFull(p) ? p.ab.map(function (s) { return (s[0] ? s[0] + ". " : "") + s[1]; }).join(" ") : p.c);
    return t.replace(/\bvs\.?\s/gi, "versus ").replace(/\bpts\b/gi, "patients").replace(/(\d)\s*%/g, "$1 percent").replace(/\s+/g, " ");
  }
  function chunks(text) {
    var parts = text.match(/[^.!?;]+[.!?;]*\s*/g) || [text], out = [], cur = "";
    parts.forEach(function (s) { if ((cur + s).length > 180 && cur) { out.push(cur); cur = s; } else cur += s; });
    if (cur.trim()) out.push(cur);
    return out;
  }
  /* iPhone and iPad Safari need extra care: speech must first be started inside a tap, the
     audio session must be switched to playback (otherwise the silent switch mutes it), a
     cancel() followed at once by speak() is ignored, and utterances must be kept referenced */
  var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var unlocked = false, keep = [], SILENT = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAADgAAA5IAQUFBQUFBQVBQUFBQUFBeXl5eXl5ebW1tbW1tbXx8fHx8fHyKioqKioqKmZmZmZmZmaioqKioqKiotra2tra2tsXFxcXFxcXU1NTU1NTU4uLi4uLi4vHx8fHx8fH/////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQDaQAAAAAAAAOSa0I+rwAAAAAAAAAAAAAAAAD/8yDEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV//MixCcAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVX/8yDETwAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVV//MgxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVf/zIMSdAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVX/8yLExAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zIsTXAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MgxNgAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zIMTYAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/8yDE2AAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MixNcAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
  var bed = null;  // silent looping track that holds the phone in media-playback mode while reading
  function unlock() {
    if (!canSpeak) return;
    /* Safari 17+: declare this page as media playback, which is not muted by the Silent switch */
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    try {
      if (!bed) { bed = new Audio(SILENT); bed.loop = true; bed.setAttribute("playsinline", ""); bed.volume = 0.01; }
      var pr = bed.play(); if (pr && pr.catch) pr.catch(function () {});
    } catch (e) {}
    if (unlocked) return;
    unlocked = true;
    try { var u = new SpeechSynthesisUtterance(" "); u.volume = 0; keep.push(u); speechSynthesis.speak(u); } catch (e) {}
  }
  function release() {
    try { if (bed) bed.pause(); } catch (e) {}
    try { if (navigator.audioSession) navigator.audioSession.type = "auto"; } catch (e) {}
  }
  function say(text, then) {
    var gen = P.gen, cs = chunks(text), v = IOS ? null : voice(), started = false;
    keep = [];
    var go = function () {
      if (gen !== P.gen) return;
      if (speechSynthesis.paused) speechSynthesis.resume();
      cs.forEach(function (c, k) {
        var u = new SpeechSynthesisUtterance(c);
        if (v) u.voice = v;
        u.lang = (v && v.lang) || "en-US"; u.rate = P.rate;
        u.onstart = function () { started = true; };
        if (k === cs.length - 1 && then) u.onend = function () { if (gen === P.gen && !P.paused) setTimeout(function () { if (gen === P.gen) then(); }, 700); };
        keep.push(u);
        speechSynthesis.speak(u);
      });
      /* tell the listener if nothing starts */
      setTimeout(function () {
        if (gen === P.gen && !started && !P.paused && !bar.hidden) {
          bar.querySelector(".pos").textContent = IOS ? "No sound? Turn off Silent mode and raise the volume, then tap Replay" : "No sound? Check the volume, then tap Replay";
          P.done = true; bar.querySelector(".ps").textContent = "Replay";
        }
      }, 4000);
    };
    if (IOS && (speechSynthesis.speaking || speechSynthesis.pending)) { speechSynthesis.cancel(); setTimeout(go, 150); }
    else go();
  }
  function play(i, intro, full) {
    if (i < 0 || i >= P.list.length) { stop(); return; }
    P.i = i; P.paused = false; P.done = false; P.end = false;
    P.gen++;
    if (!IOS && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
    P.full = !!full;
    say((intro ? intro + " " : "") + (full ? spokenFull(P.list[i]) : spoken(P.list[i])), finished);
    updateBar();
    markPlaying(true);
    keepAwake(P.auto);
  }
  /* what happens when a paper has been read */
  function finished() {
    var cur = P.list[P.i];
    if (cur && cur.p) setHeard("pm" + cur.p, true);
    if (!P.auto) { P.done = true; updateBar(); return; }           // default: wait for Next
    if (P.i + 1 < P.list.length) { play(P.i + 1); return; }
    var k = ORDER.indexOf(P.tk);                                    // end of a topic: go on to the next one
    for (var j = k + 1; j < ORDER.length; j++) {
      var nl = (LISTS[ORDER[j]] || []).filter(function (p) { return p.c; });
      if (nl.length) {
        var title = (TITLES[ORDER[j]] || "").replace(/^AML and MDS$/, "A M L and M D S");
        startTopic(ORDER[j], null, "Next topic: " + title + ".");
        return;
      }
    }
    P.gen++;
    say("End of this week's digest.", null);
    P.done = true; P.end = true; updateBar(); keepAwake(false);
  }
  function updateBar() {
    var p = P.list[P.i];
    if (!p) return;
    bar.querySelector(".pos").textContent = P.end ? "End of this week\u2019s digest" : (P.done ? "Finished " : "Listening: ") + (P.i + 1) + " of " + P.list.length;
    bar.querySelector(".ttl").textContent = P.done && !P.end && P.i < P.list.length - 1 ? "Press \u203a for the next paper" : p.t;
    bar.querySelector(".pv").disabled = P.i === 0;
    bar.querySelector(".nx").disabled = P.i === P.list.length - 1;
    bar.querySelector(".ps").textContent = P.done ? "Replay" : P.paused ? "Resume" : "Pause";
    bar.querySelector(".fa").hidden = !!P.end || !hasFull(p) || (!!P.full && !P.done);
    if (P.full && !P.done && !P.end) bar.querySelector(".pos").textContent = "Full abstract: " + (P.i + 1) + " of " + P.list.length;
    bar.querySelector(".spd").textContent = P.rate + "×";
    bar.hidden = false;
  }
  function markPlaying(scroll) {
    [].forEach.call(root.querySelectorAll("li.playing"), function (x) { x.classList.remove("playing"); });
    if (bar.hidden || P.i < 0) return;
    var p = P.list[P.i], li = null;
    [].forEach.call(root.querySelectorAll('.it[data-t="' + P.tk + '"] li[data-k]'), function (x) {
      var k = x.getAttribute("data-k").split(":"), arr = LISTS[k[0]];
      if (arr && arr[+k[1]] === p) li = x;
    });
    if (li) { li.classList.add("playing"); if (scroll) li.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  }
  function stop() {
    release();
    P.gen++; speechSynthesis.cancel(); P.i = -1; P.done = false; P.end = false; bar.hidden = true; markPlaying(); keepAwake(false);
  }
  function startTopic(tk, at, intro, full) {
    var list = (LISTS[tk] || []).filter(function (p) { return p.c; });
    if (!list.length) return;
    P.list = list; P.tk = tk;
    var item = root.querySelector('.it[data-t="' + tk + '"]');
    if (item && !item.classList.contains("open")) toggle(item, true);
    play(at ? Math.max(0, list.indexOf(at)) : 0, intro, full);
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    unlock();
    if (b.classList.contains("fa")) play(P.i, null, true);
    else if (b.classList.contains("nx")) play(P.i + 1);
    else if (b.classList.contains("pv")) play(P.i - 1);
    else if (b.classList.contains("x")) stop();
    else if (b.classList.contains("au")) setAuto(!P.auto);
    else if (b.classList.contains("ps")) {
      if (P.done) { play(P.i); return; }
      if (P.paused) { P.paused = false; if (speechSynthesis.paused) speechSynthesis.resume(); else play(P.i); }
      else { P.paused = true; speechSynthesis.pause(); }
      updateBar();
    } else if (b.classList.contains("spd")) {
      P.rate = RATES[(RATES.indexOf(P.rate) + 1) % RATES.length];
      if (!P.paused) play(P.i); else updateBar();
    }
  });
  window.addEventListener("pagehide", function () { if (canSpeak) speechSynthesis.cancel(); });

  /* ---------- interactions ---------- */
  function toggle(item, on) {
    on = on == null ? !item.classList.contains("open") : on;
    item.classList.toggle("open", on);
    state.open[item.getAttribute("data-t")] = on;
    var b = item.querySelector("button.t");
    b.setAttribute("aria-expanded", on);
    b.querySelector(".pm").textContent = on ? "–" : "+";
  }
  mount.addEventListener("click", function (e) {
    var rli = e.target.closest("li[data-rid]");
    if (rli && e.target.closest("button.hd")) { setHeard(rli.getAttribute("data-rid"), false); return; }
    if (rli && e.target.closest("button.rd")) { setRead(rli.getAttribute("data-rid"), !isRead(rli.getAttribute("data-rid"))); return; }
    if (e.target.closest("button.sv")) { onSave(e.target.closest("button.sv")); return; }
    if (savedToolClick(e, mount)) return;
    if (rli && e.target.closest("a")) setRead(rli.getAttribute("data-rid"), true);
    var t = e.target.closest("button.t");
    if (t) { toggle(t.parentNode); return; }
    if (e.target.closest("#hdg-auto")) { setAuto(!P.auto); return; }
    if (e.target.closest(".prev")) { loadWeek(Math.min(INDEX.weeks.length - 1, state.wi + 1)); return; }
    if (e.target.closest(".next")) { loadWeek(Math.max(0, state.wi - 1)); return; }
    var ea = e.target.closest("button.earlier");
    if (ea) { showEarlier(ea.getAttribute("data-topic"), ea); return; }
    if (e.target.closest("button.listen, button[data-play]")) unlock();
    var lt = e.target.closest("button.listen");
    if (lt) { startTopic(lt.getAttribute("data-topic")); return; }
    var one = e.target.closest("button[data-play]");
    if (one) {
      var k = one.getAttribute("data-play").split(":");
      startTopic(k[0], LISTS[k[0]][+k[1]], null, one.hasAttribute("data-full"));
    }
  });
  mount.addEventListener("change", function (e) { if (e.target.tagName === "SELECT") loadWeek(+e.target.value); });
  mount.addEventListener("change", savedFileChange);
  var timer;
  mount.addEventListener("input", function (e) {
    if (!e.target.classList.contains("q")) return;
    clearTimeout(timer);
    timer = setTimeout(function () { state.q = e.target.value; var w = INDEX.weeks[state.wi]; if (CACHE[w.week]) render(CACHE[w.week]); }, 150);
  });
  if (canSpeak) { speechSynthesis.getVoices(); if ("onvoiceschanged" in speechSynthesis) speechSynthesis.onvoiceschanged = function () {}; }
})();
