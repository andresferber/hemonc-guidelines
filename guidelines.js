/* Hematology guidelines widget for andresferber.org
   Usage on any web page:
     <div id="hemonc-guidelines"></div>
     <script src="https://andresferber.github.io/hemonc-guidelines/guidelines.js"></script>
   Reads guidelines.json next to this file (curated list, refreshed by the monthly
   update) and, live in the browser, asks PubMed for guideline papers indexed in the
   last 60 days that are not yet on the list ("Just published, not yet reviewed").
   Deep link: #gl-<key> opens the right section at that guideline. */
(function () {
  "use strict";
  var me = document.currentScript;
  var base = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, "") : "";
  var mount = document.getElementById("hemonc-guidelines");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "hemonc-guidelines";
    if (me && me.parentNode) me.parentNode.insertBefore(mount, me);
    else document.body.appendChild(mount);
  }
  var bust = "?v=" + Math.floor(Date.now() / 600000);
  var NEW_DAYS = 183;
  var MAIL = "andresferber@hotmail.com";
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------- styles (scoped to .hog; !important where Weebly themes interfere) ---------- */
  if (!document.getElementById("hog-font")) {
    var lf = document.createElement("link");
    lf.id = "hog-font"; lf.rel = "stylesheet";
    lf.href = "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap";
    document.head.appendChild(lf);
  }
  var css = [
    ".hog{container-type:inline-size;--sky:#a9e4f8;--sky2:#d6f2fc;--ink:#1f2a33;--muted:#56656f;--deep:#145a75;--rule:#cfe3ea;--paper:#fff;--new:#9a5a00;--newbg:#fff1d6;--old:#8a959c;",
    "font:400 16px/1.5 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);text-align:left;display:flex;flex-direction:column;gap:14px;font-variant-numeric:tabular-nums}",
    ".hog *{box-sizing:border-box}",
    ".hog a{color:var(--deep)!important;text-decoration:underline!important;text-underline-offset:2px;text-decoration-thickness:1px}",
    ".hog a:hover{text-decoration-thickness:2px}",
    ".hog p{margin:0!important;padding:0!important}",
    /* toolbar */
    ".hog .hog-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
    ".hog .hog-pins{display:flex;gap:10px;flex-wrap:wrap}",
    ".hog a.hog-pin{display:inline-flex;align-items:center;gap:8px;font:700 16px/1.2 'Source Sans 3',system-ui,sans-serif!important;color:#fff!important;background:var(--deep)!important;text-decoration:none!important;border-radius:8px;padding:12px 16px}",
    ".hog a.hog-pin:hover{background:#0f4a61!important}",
    ".hog a.hog-pin:focus-visible{outline:3px solid rgba(20,90,117,.45);outline-offset:2px}",
    ".hog a.hog-pin svg{flex:none}",
    ".hog .hog-q{all:unset;box-sizing:border-box;flex:1 1 260px;min-width:0;font:400 16px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important;background:var(--paper)!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:11px 14px!important;height:auto!important}",
    ".hog .hog-q:focus{outline:3px solid rgba(20,90,117,.28);outline-offset:1px}",
    ".hog button.hog-btn{all:unset;box-sizing:border-box;cursor:pointer;font:600 14px/1 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;background:var(--paper)!important;border:1px solid #9cc9d8!important;border-radius:8px;padding:12px 14px!important;height:auto!important;text-transform:none!important;box-shadow:none!important}",
    ".hog button.hog-btn:hover{background:var(--sky2)!important}",
    ".hog button:focus-visible,.hog .hog-t:focus-visible{outline:3px solid rgba(20,90,117,.45)!important;outline-offset:2px}",
    ".hog .hog-status{font-size:14px;color:var(--muted)}",
    /* what's recent */
    ".hog .hog-recent{background:var(--sky2);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}",
    ".hog .hog-recent h3{margin:0!important;font:700 15px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;text-transform:none!important;letter-spacing:0!important}",
    ".hog .hog-recent ul{margin:0!important;padding:0!important;list-style:none!important}",
    ".hog .hog-recent li{margin:0!important;padding:3px 0!important;list-style:none!important;background:none!important;font-size:15px;line-height:1.4;display:grid;grid-template-columns:76px 1fr;gap:10px}",
    ".hog .hog-recent li .when{color:var(--muted);font-size:14px;white-space:nowrap}",
    ".hog details.hog-live{border-top:1px solid #b7dfec;padding-top:8px}",
    ".hog details.hog-live summary{cursor:pointer;font-weight:600;color:var(--deep);font-size:15px;list-style:revert!important}",
    ".hog details.hog-live p.hog-why{font-size:13.5px;color:var(--muted);margin:6px 0 4px}",
    /* accordion */
    ".hog .hog-acc{display:flex;flex-direction:column}",
    ".hog .hog-item{border:1px solid #8fbccb;margin-top:-1px;background:var(--paper)}",
    ".hog .hog-item:first-child{border-radius:8px 8px 0 0}",
    ".hog .hog-item:last-child{border-radius:0 0 8px 8px}",
    ".hog .hog-t{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:2px 12px;align-items:center;width:100%;padding:12px 16px!important;background:var(--sky)!important;color:var(--ink)!important;height:auto!important;text-transform:none!important;box-shadow:none!important}",
    ".hog .hog-item:first-child .hog-t{border-radius:7px 7px 0 0}",
    ".hog .hog-item:last-child:not(.open) .hog-t{border-radius:0 0 7px 7px}",
    ".hog .hog-t:hover{background:#97dcf4!important}",
    ".hog .hog-item.open > .hog-t{background:#76cae9!important}",
    ".hog .hog-t .nm{font:700 16.5px/1.25 'Source Sans 3',system-ui,sans-serif!important;color:var(--ink)!important}",
    ".hog .hog-t .sb{grid-column:1;font-size:14px;color:#2f4a55;line-height:1.3}",
    ".hog .hog-t .rt{grid-row:1/span 2;grid-column:2;display:flex;gap:8px;align-items:center;font-size:14px;color:#2f4a55;white-space:nowrap}",
    ".hog .hog-t .pm{font:400 22px/1 'Source Sans 3',system-ui,sans-serif;width:18px;text-align:center;color:var(--deep)}",
    ".hog .badge{display:inline-block;font:600 12.5px/1 'Source Sans 3',system-ui,sans-serif;padding:4px 7px;border-radius:999px;background:var(--newbg);color:var(--new)!important;white-space:nowrap}",
    ".hog .badge.lv{background:#e3f1f6;color:var(--deep)!important}",
    ".hog .badge.ol{background:#eef0f1;color:#5d676d!important}",
    ".hog .hog-c{display:none;padding:6px 16px 16px}",
    ".hog .hog-item.open > .hog-c{display:block}",
    ".hog .hog-sub{font:700 14.5px/1.3 'Source Sans 3',system-ui,sans-serif!important;color:var(--deep)!important;margin:14px 0 2px!important;padding:0 0 4px!important;border-bottom:1px solid var(--rule);text-transform:none!important;letter-spacing:0!important}",
    ".hog ol.hog-list{margin:0!important;padding:0!important;list-style:none!important}",
    ".hog ol.hog-list > li{list-style:none!important;background:none!important;margin:0!important;padding:10px 0!important;border-bottom:1px solid #eef4f6;display:grid;grid-template-columns:76px 1fr;gap:12px}",
    ".hog ol.hog-list > li:last-child{border-bottom:0}",
    ".hog ol.hog-list > li.hl{background:#fffbe9!important;transition:background 1.2s}",
    ".hog .dt{white-space:nowrap;font-size:14px;color:var(--muted);padding-top:1px;line-height:1.35}",
    ".hog .dt.isnew{color:var(--new);font-weight:600}",
    ".hog .gn{font-weight:600;font-size:16px;line-height:1.35;overflow-wrap:anywhere;min-width:0}",
    ".hog .gn.lv{font-weight:400;font-size:15px}",
    ".hog .gn a{color:var(--ink)!important;text-decoration-color:#9cc9d8!important}",
    ".hog .gn a:hover{color:var(--deep)!important}",
    ".hog li.old .gn,.hog li.old .gn a{color:var(--old)!important;font-weight:400}",
    ".hog .org{font-size:14px;color:var(--muted)}",
    ".hog .note{font-size:15px;color:#33434c;margin-top:2px}",
    ".hog .lk{font-size:14px;margin-top:4px;display:flex;flex-wrap:wrap;gap:4px 14px}",
    ".hog .lk .free{color:#1d6b3d!important}",
    ".hog mark.hss-hit{background:#ffd54a!important;color:inherit!important;padding:0 1px;border-radius:2px}",
    ".hog ol.hog-list > li.hl{box-shadow:-8px 0 0 #fffbe9,-12px 0 0 #e0a800}",
    ".hog .hog-empty{padding:12px 0;color:var(--muted)}",
    ".hog .hog-foot{font-size:13.5px;color:var(--muted);line-height:1.5;display:flex;flex-direction:column;gap:6px}",
    ".hog mark{background:#fff0a8;color:inherit;padding:0 1px}",
    "@container (max-width:460px){.hog ol.hog-list > li,.hog .hog-recent li{grid-template-columns:70px 1fr;gap:10px}.hog .hog-t{padding:10px 12px!important}.hog .hog-c{padding:4px 12px 12px}}",
    "@container (max-width:360px){.hog ol.hog-list > li,.hog .hog-recent li{grid-template-columns:1fr;gap:2px}}",
    "@media (max-width:560px){.hog .hog-t .sb{display:none}}",
    "@media (prefers-reduced-motion:reduce){.hog *{transition:none!important}}",
    "@media print{.hog .hog-bar,.hog details.hog-live{display:none}.hog .hog-c{display:block!important}}"
  ].join("\n");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmtDate(d) {
    if (!d) return "";
    var p = d.split("-");
    return p[1] ? MON[+p[1] - 1] + " " + p[0] : p[0];
  }
  function ageDays(d) {
    if (!d) return 1e9;
    var p = d.split("-");
    var t = new Date(+p[0], (p[1] ? +p[1] : 12) - 1, 15).getTime();
    return (Date.now() - t) / 864e5;
  }
  function isNew(e) { return !e.old && !e.u && ageDays(e.d) <= NEW_DAYS; }
  function mainLink(e) {
    if (e.u) return e.u;
    if (e.free === "pmc") return "https://pmc.ncbi.nlm.nih.gov/articles/" + e.pmc + "/";
    if (e.doi) return "https://doi.org/" + e.doi;
    return "https://pubmed.ncbi.nlm.nih.gov/" + e.p + "/";
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function hilite(text, q) {
    var t = esc(text);
    if (!q) return t;
    var i = norm(text).indexOf(q);
    if (i < 0) return t;
    var raw = String(text);
    return esc(raw.slice(0, i)) + "<mark>" + esc(raw.slice(i, i + q.length)) + "</mark>" + esc(raw.slice(i + q.length));
  }

  /* ===== SAVED CORE: identical in resources.js, digest.js and guidelines.js =====
     One shared list for the whole site, kept in this browser (localStorage key hogSaved). Nothing is sent anywhere unless the owner
     turns on sync (SYNC_URL below, hidden from readers); removals are remembered in hogSavedDel so sync can carry them.
     Entry: { m: time last changed (used to merge devices),  s: "papers"|"digest"|"guide", g: topic heading, n: title, u: link, t: time saved, o: organisation,
              x: note or conclusion, xl: its label, k: guideline key, paper: { p: PMID, j: journal, a: authors, d: date, ty: type } }
     A snapshot is stored, so a saved item stays after it leaves its feed. Backups are plain JSON files the reader
     downloads and restores. Every write re-reads the store first, so the three sections never overwrite each other. */
  var SK = "hogSaved", DK = "hogSavedDel", MK = "hogSavedMod", SAVED = {}, DELS = {}, saveWarn = false, firstSave = {};
  /* Owner-only sync: address of the sync Worker (see sync/README.md). Empty = sync is off and invisible. */
  var SYNC_URL = "https://hog-sync.andresferber.workers.dev/", SYNC_KEYK = "hogSyncKey", SYNC_SHOWK = "hogSyncShow", SYNC_LASTK = "hogSyncLast", SYNC_SKEWK = "hogSyncSkew", POLL_MS = 45000, RK_ = "hogRead", HK_ = "hogHeard";
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
  /* time stamp for changes: this device's clock corrected by how far it differs from the sync server's clock */
  function stamp() { return Date.now() + (+lsGet(SYNC_SKEWK) || 0); }
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
    if (SAVED[id]) { delete SAVED[id]; DELS[id] = stamp(); now = false; } else { SAVED[id] = c[id]; SAVED[id].m = stamp(); delete DELS[id]; now = true; }
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
        if (!SAVED[k]) { SAVED[k] = inc[k]; if (!SAVED[k].t) SAVED[k].t = Date.now(); SAVED[k].m = stamp(); delete DELS[k]; added++; }
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
  /* ---------- "opened" and "listened" marks travel with sync too ----------
     hogRead / hogHeard map an id to the time it was marked; un-marking leaves a removal time in hogMarkDel ("r:id" / "h:id").
     Same rule as saved items: per id the newest change wins. The marks code of each section calls markTomb() after a change. */
  var MD = "hogMarkDel";
  function cleanMarkMap(o) {
    var r = {};
    if (o && typeof o === "object" && !Array.isArray(o)) Object.keys(o).slice(0, 20000).forEach(function (k) { var v = +o[k]; if (v > 0 && k.length < 800) r[k] = v; });
    return r;
  }
  function lsMap(k) { try { return cleanMarkMap(JSON.parse(localStorage.getItem(k) || "{}")); } catch (e) { return {}; } }
  function putMap(k, o) { try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} }
  function markTomb(p, id, on) { var md = lsMap(MD); if (on) delete md[p + id]; else md[p + id] = stamp(); putMap(MD, md); scheduleSync(); }
  function marksPayload() { return { read: lsMap(RK_), heard: lsMap(HK_), mdels: lsMap(MD) }; }
  function mergeMarks(j) {
    var inc = j && typeof j === "object" ? j : {}, changed = false, cut = Date.now() - 365 * 864e5, md = lsMap(MD), rmd = cleanMarkMap(inc.mdels);
    Object.keys(rmd).forEach(function (k) { if (rmd[k] > (md[k] || 0)) { md[k] = rmd[k]; changed = true; } });
    [[RK_, "r:", inc.read], [HK_, "h:", inc.heard]].forEach(function (p) {
      var loc = lsMap(p[0]), rem = cleanMarkMap(p[2]), before = JSON.stringify(loc);
      Object.keys(rem).forEach(function (id) { if (rem[id] > (loc[id] || 0)) loc[id] = rem[id]; });
      Object.keys(loc).forEach(function (id) { if ((md[p[1] + id] || 0) >= loc[id] || loc[id] < cut) delete loc[id]; });
      if (JSON.stringify(loc) !== before) { putMap(p[0], loc); changed = true; }
    });
    Object.keys(md).forEach(function (k) { if (md[k] < cut) delete md[k]; });
    putMap(MD, md);
    return changed;
  }
  function syncUi() {
    [].forEach.call(document.querySelectorAll(".sv-sync-st"), function (el) { el.textContent = syncStatus(); });
  }
  var syncTimer, syncPending = false;
  function scheduleSync() {
    if (!SYNC_URL || !syncKey()) return;
    clearTimeout(syncTimer); syncPending = true;
    syncTimer = setTimeout(function () { runSync(false); }, 1500);
  }
  /* page is being hidden or closed: send a waiting change now instead of losing it */
  function flushSync() { if (syncPending) { clearTimeout(syncTimer); runSync(false, true); } }
  function runSync(manual, leaving) {
    var key = syncKey();
    if (!SYNC_URL || !key || typeof fetch !== "function") return;
    if (window.__hogSyncBusy) { window.__hogSyncAgain = true; return; }
    window.__hogSyncBusy = true; window.__hogSyncAt = Date.now(); syncPending = false; syncUi();
    syncSaved();
    var pl = marksPayload(), body = JSON.stringify({ items: SAVED, dels: DELS, read: pl.read, heard: pl.heard, mdels: pl.mdels }), t0 = Date.now();
    fetch(SYNC_URL, { method: "POST", headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" }, body: body, keepalive: !!leaving && body.length < 60000 })
      .then(function (r) {
        if (r.status === 401) throw new Error("wrong sync key");
        if (!r.ok) throw new Error("the sync service had a problem");
        return r.json();
      })
      .then(function (j) {
        if (j && +j.now) lsSet(SYNC_SKEWK, String(Math.round(+j.now - (t0 + Date.now()) / 2)));
        syncSaved();
        var changed = mergeRemote(j && j.items, j && j.dels), mch = mergeMarks(j);
        if (changed) { persistSaved(); savedChanged(); }
        if (mch) window.dispatchEvent(new Event("hog-marks"));
        changed = changed || mch;
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
    var due = function (ms) { return syncKey() && document.visibilityState === "visible" && Date.now() - (window.__hogSyncAt || 0) > ms; };
    if (syncKey()) setTimeout(function () { runSync(false); }, 500);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flushSync();
      else if (due(15000)) runSync(false);
    });
    window.addEventListener("pagehide", flushSync);
    window.addEventListener("online", function () { if (syncKey()) runSync(false); });
    /* while the page is open, look for changes from other devices now and then */
    setInterval(function () { if (due(POLL_MS - 5000)) runSync(false); }, POLL_MS);
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

  /* ---------- Saved guidelines row ---------- */
  var svN = 0;
  function savedRowHTML(e, q) {
    var pp = e.paper, sidv = makeSid("guide", "", "", e.k), links = [];
    if (pp.p) links.push('<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(pp.p) + '/" target="_blank" rel="noopener">PubMed</a>');
    links.push('<a href="#gl-' + esc(e.k) + '" data-jump="' + esc(e.k) + '">Show in list</a>');
    links.push(saveBtnHTML(sidv, "Save this guideline"));
    return "<li><div class=\"dt\">" + (pp.d ? esc(fmtDate(pp.d)) : "Portal") + "</div><div>" +
      '<div class="gn"><a href="' + esc(e.u) + '" target="_blank" rel="noopener">' + hilite(e.n, q) + "</a></div>" +
      (e.o ? '<div class="org">' + hilite(e.o, q) + "</div>" : "") +
      (e.x ? '<p class="note">' + hilite(e.x, q) + "</p>" : "") +
      '<div class="lk">' + links.join("") + "</div></div></li>";
  }
  function savedPanelHTML(q, open) {
    var all = savedList("guide"), items = all.filter(function (e) { return !q || norm([e.n, e.o, e.x, e.g].join(" ")).indexOf(q) >= 0; });
    svN = items.length;
    if (q && !items.length) return "";
    var isOpen = q ? true : !!open.saved;
    var order = DATA ? DATA.categories.map(function (c) { return c.title; }) : [];
    var body = items.length ? savedGroupsHTML(items, order, function (e) { return savedRowHTML(e, q); }, "hog-list")
      : (q ? "" : '<p class="sv-empty">Nothing saved yet. Tap ☆ Save under any guideline to keep it here, grouped by category.</p>');
    if (!q) body += savedToolsHTML();
    return '<div class="hog-item' + (isOpen ? " open" : "") + '" data-k="saved">' +
      '<button class="hog-t" type="button" aria-expanded="' + isOpen + '" aria-controls="hogc-saved"><span class="nm">★ Saved guidelines</span>' +
      '<span class="rt"><span>' + (q ? items.length + " of " + all.length : all.length) + '</span><span class="pm" aria-hidden="true">' + (isOpen ? "–" : "+") + "</span></span>" +
      '<span class="sb">Guidelines you starred, grouped by category; kept on this device only</span></button>' +
      '<div class="hog-c" id="hogc-saved" role="region">' + body + "</div></div>";
  }
  /* after a save or unsave: redraw only the Saved row (the whole list while searching) */
  function refreshSaved() {
    if (!DATA) return;
    var acc = mount.querySelector(".hog-acc");
    if (!acc) return;
    if (state.q) { renderAcc(); return; }
    var item = acc.querySelector('.hog-item[data-k="saved"]'), tmp = document.createElement("div");
    tmp.innerHTML = savedPanelHTML("", { saved: item && item.classList.contains("open") });
    if (!tmp.firstChild) return;
    if (item) item.parentNode.replaceChild(tmp.firstChild, item); else acc.insertBefore(tmp.firstChild, acc.firstChild);
  }
  function onSave(btn) {
    var sidv = btn.getAttribute("data-sid"), snap = SAVED[sidv];
    if (!snap) {
      var k = sidv.replace(/^guide:/, ""), e = DATA.entries.filter(function (x) { return x.k === k; })[0];
      if (!e) return;
      var cat = DATA.categories.filter(function (c) { return c.key === e.c; })[0];
      snap = { s: "guide", g: cat ? cat.title : "", n: e.n, u: mainLink(e), t: Date.now(), k: e.k,
        o: [e.o, e.cite].filter(Boolean).join(". "), x: e.x || "", paper: { p: e.p || "", d: e.d || "" } };
    }
    saveToast(toggleSaveEntry(snap), "Saved guidelines", snap);
  }
  window.addEventListener("hog-saved", refreshSaved);

  function rowHTML(e, q) {
    var links = [];
    if (e.u) {
      links.push('<a href="' + esc(e.u) + '" target="_blank" rel="noopener">Open site</a>');
    } else {
      if (e.free === "pmc") links.push('<a class="free" href="https://pmc.ncbi.nlm.nih.gov/articles/' + esc(e.pmc) + '/" target="_blank" rel="noopener">Free full text</a>');
      else if (e.doi) links.push('<a' + (e.free === "publisher" ? ' class="free"' : "") + ' href="https://doi.org/' + esc(e.doi) + '" target="_blank" rel="noopener">' + (e.free === "publisher" ? "Free at publisher" : "Publisher") + "</a>");
      if (e.free === "repo" && e.repo) links.push('<a class="free" href="' + esc(e.repo) + '" target="_blank" rel="noopener">Free copy (repository)</a>');
      links.push('<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(e.p) + '/" target="_blank" rel="noopener">PubMed</a>');
    }
    var badges = "";
    if (isNew(e)) badges += ' <span class="badge">New</span>';
    if (e.living) badges += ' <span class="badge lv">Living guideline</span>';
    if (e.old) badges += ' <span class="badge ol">Earlier version</span>';
    var cite = e.cite ? esc(e.cite) : "";
    links.push(saveBtnHTML(makeSid("guide", "", "", e.k), "Save this guideline"));
    return '<li id="gl-' + esc(e.k) + '"' + (e.old ? ' class="old"' : "") + ">" +
      '<div class="dt' + (isNew(e) ? " isnew" : "") + '">' + (e.u ? "Portal" : esc(fmtDate(e.d))) + "</div>" +
      "<div>" +
      '<div class="gn"><a href="' + esc(mainLink(e)) + '" target="_blank" rel="noopener">' + hilite(e.n, q) + "</a>" + badges + "</div>" +
      '<div class="org">' + hilite(e.o, q) + (cite ? ". " + cite : "") + "</div>" +
      (e.x ? '<p class="note">' + hilite(e.x, q) + "</p>" : "") +
      '<div class="lk">' + links.join("") + "</div>" +
      "</div></li>";
  }

  function sortEntries(list) {
    return list.slice().sort(function (a, b) {
      if (!!a.old !== !!b.old) return a.old ? 1 : -1;
      return (b.d || "").localeCompare(a.d || "");
    });
  }

  /* ---------- build ---------- */
  var DATA = null, state = { q: "" };

  function bodyHTML(cat, entries, q) {
    var subs = [], bySub = {};
    entries.forEach(function (e) {
      var s = e.s || "";
      if (!bySub[s]) { bySub[s] = []; subs.push(s); }
      bySub[s].push(e);
    });
    if (cat.key !== "lib") subs.sort(function (a, b) { return a === "" ? -1 : b === "" ? 1 : 0; });
    return subs.map(function (s) {
      var list = cat.key === "lib" ? bySub[s] : sortEntries(bySub[s]);
      return (s ? '<h4 class="hog-sub">' + esc(s) + "</h4>" : "") +
        '<ol class="hog-list">' + list.map(function (e) { return rowHTML(e, q); }).join("") + "</ol>";
    }).join("");
  }

  function match(e, q) {
    if (!q) return true;
    return norm([e.n, e.o, e.x, e.s, e.t, e.j, e.d && fmtDate(e.d)].join(" ")).indexOf(q) >= 0;
  }

  function renderAcc() {
    var q = norm(state.q.trim());
    var acc = mount.querySelector(".hog-acc");
    var open = {};
    acc.querySelectorAll(".hog-item.open").forEach(function (n) { open[n.getAttribute("data-k")] = 1; });
    var html = "", total = 0, svHtml = savedPanelHTML(q, open);
    DATA.categories.forEach(function (c) {
      var all = DATA.entries.filter(function (e) { return e.c === c.key; });
      var hits = all.filter(function (e) { return match(e, q); });
      if (q && !hits.length) return;
      total += hits.length;
      var nNew = all.filter(isNew).length;
      var isOpen = q ? true : !!open[c.key];
      var count = q ? hits.length + " of " + all.length : all.filter(function (e) { return !e.old && !e.dup; }).length;
      html += '<div class="hog-item' + (isOpen ? " open" : "") + '" data-k="' + c.key + '">' +
        '<button class="hog-t" type="button" aria-expanded="' + isOpen + '" aria-controls="hogc-' + c.key + '">' +
        '<span class="nm">' + esc(c.title) + "</span>" +
        '<span class="rt">' + (nNew && !q ? '<span class="badge">' + nNew + " new</span>" : "") + "<span>" + count + '</span><span class="pm" aria-hidden="true">' + (isOpen ? "–" : "+") + "</span></span>" +
        '<span class="sb">' + esc(c.sub) + "</span>" +
        "</button>" +
        '<div class="hog-c" id="hogc-' + c.key + '" role="region">' + bodyHTML(c, hits, q) + "</div></div>";
    });
    acc.innerHTML = (svHtml + html) || '<p class="hog-empty">No guideline matches “' + esc(state.q) + '”. Try a disease, a society (ELN, IMWG, ASCO) or a topic such as CMV.</p>';
    mount.querySelector(".hog-status").textContent = q ? total + (total === 1 ? " guideline" : " guidelines") + " found" + (svN ? " \u00b7 " + svN + " in Saved guidelines" : "") : "";
  }

  function toggle(item, force) {
    var on = force == null ? !item.classList.contains("open") : force;
    item.classList.toggle("open", on);
    var b = item.querySelector(".hog-t");
    b.setAttribute("aria-expanded", on);
    b.querySelector(".pm").textContent = on ? "–" : "+";
  }

  function recentHTML() {
    var list = DATA.entries.filter(function (e) { return e.p && !e.old && !e.dup; })
      .sort(function (a, b) { return (b.d || "").localeCompare(a.d || ""); }).slice(0, 5);
    return '<div class="hog-recent"><h3>Most recent on this list</h3><ul>' +
      list.map(function (e) {
        return '<li><span class="when">' + esc(fmtDate(e.d)) + '</span><span><a href="#gl-' + esc(e.k) + '" data-jump="' + esc(e.k) + '">' + esc(e.n) + "</a></span></li>";
      }).join("") + "</ul>" +
      '<details class="hog-live"><summary>Just published in PubMed, not yet reviewed</summary>' +
      '<p class="hog-why">Guideline and consensus papers in hematology indexed in the last 60 days, found automatically. They are added to the list above once checked.</p>' +
      '<div class="hog-livebody"><p class="hog-why">Loading…</p></div></details></div>';
  }

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

  /* lets the Page ONE search close the panels it opened */
  (window.__hogClosers = window.__hogClosers || []).push(function (except) {
    [].slice.call(mount.querySelectorAll('.hog-item[data-sopen="1"]')).forEach(function (it) {
      if (except && it.contains(except)) return;
      it.removeAttribute("data-sopen");
      toggle(it, false);
    });
  });

  function jump(k) {
    var e = DATA.entries.filter(function (x) { return x.k === k; })[0];
    if (!e) return;
    if (state.q) { state.q = ""; mount.querySelector(".hog-q").value = ""; renderAcc(); }
    var item = mount.querySelector('.hog-item[data-k="' + e.c + '"]');
    if (item && !item.classList.contains("open")) { toggle(item, true); item.setAttribute("data-sopen", "1"); }
    var li = document.getElementById("gl-" + k);
    if (li) {
      [].slice.call(document.querySelectorAll("li.hl")).forEach(function (x) { x.classList.remove("hl"); });
      markSearched(li);
      li.scrollIntoView({ behavior: "smooth", block: "center" });
      li.classList.add("hl");
      setTimeout(function () { li.classList.remove("hl"); }, 4000);
    }
  }

  /* live PubMed feed: guideline-type papers indexed in the last 60 days */
  var LIVE_TERM = '(guideline[pt] OR practice guideline[pt] OR consensus[pt] OR guideline*[ti] OR recommendation*[ti] OR consensus[ti]) ' +
    'AND (leukemia[ti] OR leukaemia[ti] OR lymphoma*[ti] OR myeloma[ti] OR myelodysplastic[ti] OR myeloproliferative[ti] OR myelofibrosis[ti] OR polycythemia[ti] OR thrombocythemia[ti] OR mastocytosis[ti] OR amyloidosis[ti] OR waldenstrom*[ti] OR histiocyt*[ti] OR hemophagocytic[ti] OR "plasma cell"[ti] OR "stem cell transplant*"[ti] OR "hematopoietic cell"[ti] OR haematopoietic[ti] OR "graft-versus-host"[ti] OR "CAR T"[ti] OR "CAR-T"[ti] OR "chimeric antigen"[ti] OR "immune effector"[ti] OR bispecific[ti] OR "haematological malignanc*"[ti] OR "hematologic malignanc*"[ti] OR "hematological malignanc*"[ti] OR "cancer-associated thrombosis"[ti] OR ("venous thromboembolism"[ti] AND cancer[ti]) OR "febrile neutropenia"[ti] OR cardio-oncology[ti] OR thrombocytopenia[ti] OR "aplastic anemia"[ti] OR "thrombotic thrombocytopenic"[ti]) ' +
    'AND (english[la]) NOT (comment[pt] OR erratum[pt] OR published erratum[pt] OR letter[pt] OR editorial[pt] OR news[pt] OR pediatric[ti] OR paediatric[ti] OR children[ti] OR survey[ti] OR "real-world"[ti] OR adherence[ti] OR child*[ti] OR autoimmun*[ti] OR rheumat*[ti] OR economic*[ti] OR reimbursement*[ti] OR "case report"[ti])';

  function loadLive() {
    var box = mount.querySelector(".hog-livebody");
    var E = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    var known = {};
    DATA.entries.forEach(function (e) { if (e.p) known[e.p] = 1; });
    (DATA.dismissed || []).forEach(function (p) { known[p] = 1; });
    fetch(E + "esearch.fcgi?db=pubmed&retmode=json&retmax=60&sort=pub_date&datetype=edat&reldate=60&term=" + encodeURIComponent(LIVE_TERM))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var ids = (j.esearchresult.idlist || []).filter(function (p) { return !known[p]; }).slice(0, 25);
        if (!ids.length) return { result: { uids: [] } };
        return fetch(E + "esummary.fcgi?db=pubmed&retmode=json&id=" + ids.join(",")).then(function (r) { return r.json(); });
      })
      .then(function (s) {
        var out = (s.result.uids || []).map(function (k) { return s.result[k]; })
          .filter(function (x) { return x && x.title && !/^(correction|erratum|reply|response to|comment)/i.test(x.title) && !/^[A-Z][A-Za-z'\-]+ [A-Z]{1,3}, /.test(x.title); })
          .slice(0, 10);
        if (!out.length) { box.innerHTML = '<p class="hog-why">Nothing new in the last 60 days that is not already on the list.</p>'; return; }
        box.innerHTML = '<ol class="hog-list">' + out.map(function (x) {
          var d = (x.epubdate || x.pubdate || "").split(" ");
          var when = d[1] ? d[1] + " " + d[0] : d[0];
          return '<li><div class="dt">' + esc(when) + '</div><div><div class="gn lv"><a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(x.uid) + '/" target="_blank" rel="noopener">' + esc(x.title.replace(/\.$/, "")) + '</a></div><div class="org">' + esc(x.source) + "</div></div></li>";
        }).join("") + "</ol>";
      })
      .catch(function () { box.innerHTML = '<p class="hog-why">PubMed could not be reached just now. Reload the page to try again.</p>'; });
  }

  function build(data) {
    DATA = data;
    var built = data.built ? fmtDate(data.built.slice(0, 7)) : "";
    var n = data.entries.filter(function (e) { return !e.u && !e.old && !e.dup; }).length;
    var pins = data.entries.filter(function (e) { return e.pin && e.u; });
    var ext = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 6 10M11 9v4H3V5h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    mount.innerHTML = '<div class="hog">' +
      (pins.length ? '<nav class="hog-pins" aria-label="Most used guidelines">' + pins.map(function (e) {
        return '<a class="hog-pin" href="' + esc(e.u) + '" target="_blank" rel="noopener">' + esc(e.pin) + ext + "</a>";
      }).join("") + "</nav>" : "") +
      '<div class="hog-bar"><input class="hog-q" type="search" placeholder="Search guidelines: disease, society, topic (e.g. CMV, ELN, CAR-T)" aria-label="Search guidelines">' +
      '<button class="hog-btn hog-all" type="button">Open all</button></div>' +
      '<div class="hog-status" aria-live="polite"></div>' +
      recentHTML() +
      '<div class="hog-acc"></div>' +
      '<div class="hog-foot"><p>' + n + " guidelines and consensus statements, plus society libraries. Checked monthly for new and updated versions" + (built ? "; last checked " + esc(data.built) : "") + ". “New” marks a publication from the last 6 months.</p>" +
      "<p>For education only: not medical advice and not a substitute for the full guideline text or clinical judgment. Always check the publisher’s current version.</p>" +
      '<p>Missing a guideline or found an error? <a href="mailto:' + MAIL + '?subject=Guidelines%20section">Send a suggestion</a>.</p></div>' +
      "</div>";
    renderAcc();

    var root = mount.querySelector(".hog");
    root.addEventListener("click", function (ev) {
      var svb = ev.target.closest("button.sv");
      if (svb) { onSave(svb); return; }
      if (savedToolClick(ev, root)) return;
      var t = ev.target.closest(".hog-t");
      if (t) { toggle(t.parentNode); return; }
      var j = ev.target.closest("[data-jump]");
      if (j) { ev.preventDefault(); jump(j.getAttribute("data-jump")); return; }
      if (ev.target.closest(".hog-all")) {
        var items = root.querySelectorAll(".hog-item");
        var anyClosed = [].some.call(items, function (i) { return !i.classList.contains("open"); });
        items.forEach(function (i) { toggle(i, anyClosed); });
        ev.target.closest(".hog-all").textContent = anyClosed ? "Close all" : "Open all";
      }
    });
    root.addEventListener("change", savedFileChange);
    var timer;
    root.querySelector(".hog-q").addEventListener("input", function (ev) {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = ev.target.value; renderAcc(); }, 120);
    });
    root.querySelector("details.hog-live").addEventListener("toggle", function once(ev) {
      if (ev.target.open) { loadLive(); ev.target.removeEventListener("toggle", once); }
    });
    function fromHash() {
      var h = location.hash.match(/^#gl-(.+)$/);
      if (h) setTimeout(function () { jump(decodeURIComponent(h[1])); }, 50);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }

  fetch(base + "guidelines.json" + bust)
    .then(function (r) { return r.json(); })
    .then(build)
    .catch(function () {
      mount.innerHTML = '<p style="color:#56656f">The guideline list could not be loaded. Please reload the page.</p>';
    });
})();
