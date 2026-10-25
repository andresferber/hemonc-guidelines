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
    ".hog{--sky:#a9e4f8;--sky2:#d6f2fc;--ink:#1f2a33;--muted:#56656f;--deep:#145a75;--rule:#cfe3ea;--paper:#fff;--new:#9a5a00;--newbg:#fff1d6;--old:#8a959c;",
    "font:400 16px/1.5 'Source Sans 3',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);text-align:left;display:flex;flex-direction:column;gap:14px;font-variant-numeric:tabular-nums}",
    ".hog *{box-sizing:border-box}",
    ".hog a{color:var(--deep)!important;text-decoration:underline!important;text-underline-offset:2px;text-decoration-thickness:1px}",
    ".hog a:hover{text-decoration-thickness:2px}",
    ".hog p{margin:0}",
    /* toolbar */
    ".hog .hog-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
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
    ".hog .hog-recent li .when{color:var(--muted);font-size:14px}",
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
    ".hog .dt{font-size:14.5px;color:var(--muted);padding-top:1px}",
    ".hog .dt.isnew{color:var(--new);font-weight:600}",
    ".hog .gn{font-weight:600;font-size:16px;line-height:1.35}",
    ".hog .gn.lv{font-weight:400;font-size:15px}",
    ".hog .gn a{color:var(--ink)!important;text-decoration-color:#9cc9d8!important}",
    ".hog .gn a:hover{color:var(--deep)!important}",
    ".hog li.old .gn,.hog li.old .gn a{color:var(--old)!important;font-weight:400}",
    ".hog .org{font-size:14px;color:var(--muted)}",
    ".hog .note{font-size:15px;color:#33434c;margin-top:2px}",
    ".hog .lk{font-size:14px;margin-top:4px;display:flex;flex-wrap:wrap;gap:4px 14px}",
    ".hog .lk .free{color:#1d6b3d!important}",
    ".hog .hog-empty{padding:12px 0;color:var(--muted)}",
    ".hog .hog-foot{font-size:13.5px;color:var(--muted);line-height:1.5;display:flex;flex-direction:column;gap:6px}",
    ".hog mark{background:#fff0a8;color:inherit;padding:0 1px}",
    "@media (max-width:560px){.hog ol.hog-list > li,.hog .hog-recent li{grid-template-columns:1fr;gap:2px}.hog .hog-t .sb{display:none}}",
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
    var html = "", total = 0;
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
    acc.innerHTML = html || '<p class="hog-empty">No guideline matches “' + esc(state.q) + '”. Try a disease, a society (ELN, IMWG, ASCO) or a topic such as CMV.</p>';
    mount.querySelector(".hog-status").textContent = q ? total + (total === 1 ? " guideline" : " guidelines") + " found" : "";
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

  function jump(k) {
    var e = DATA.entries.filter(function (x) { return x.k === k; })[0];
    if (!e) return;
    if (state.q) { state.q = ""; mount.querySelector(".hog-q").value = ""; renderAcc(); }
    var item = mount.querySelector('.hog-item[data-k="' + e.c + '"]');
    if (item) toggle(item, true);
    var li = document.getElementById("gl-" + k);
    if (li) {
      li.scrollIntoView({ behavior: "smooth", block: "center" });
      li.classList.add("hl");
      setTimeout(function () { li.classList.remove("hl"); }, 1800);
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
    mount.innerHTML = '<div class="hog">' +
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
    var timer;
    root.querySelector(".hog-q").addEventListener("input", function (ev) {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = ev.target.value; renderAcc(); }, 120);
    });
    root.querySelector("details.hog-live").addEventListener("toggle", function once(ev) {
      if (ev.target.open) { loadLive(); ev.target.removeEventListener("toggle", once); }
    });
    var h = location.hash.match(/^#gl-(.+)$/);
    if (h) setTimeout(function () { jump(decodeURIComponent(h[1])); }, 50);
  }

  fetch(base + "guidelines.json" + bust)
    .then(function (r) { return r.json(); })
    .then(build)
    .catch(function () {
      mount.innerHTML = '<p style="color:#56656f">The guideline list could not be loaded. Please reload the page.</p>';
    });
})();
