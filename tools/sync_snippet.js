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
