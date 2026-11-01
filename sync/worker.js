/* Sync Worker for the Saved lists on andresferber.org (owner only).
   Cloudflare Worker with one KV namespace bound as SAVED_KV and one secret named SYNC_KEY.
   POST with header "Authorization: Bearer <SYNC_KEY>" and body {items:{id:entry}, dels:{id:time}};
   it merges that with what is stored (newest change per item wins, removals included), stores the result
   and returns it. Without the right key nothing is read or written. See sync/README.md for setup. */
const SITE_ORIGINS = ["https://andresferber.org", "https://www.andresferber.org", "https://andresferber.github.io"];
const ID = /^(papers|digest|guide):.{1,700}$/;
const MAX_BODY = 1500000, MAX_ITEMS = 2000, MAX_DELS = 5000, KEEP_DELS_MS = 180 * 864e5;

function cors(origin, env) {
  const ok = SITE_ORIGINS.concat(String(env.ALLOWED_ORIGINS || "").split(",").filter(Boolean));
  const h = { "Cache-Control": "no-store", "Vary": "Origin" };
  if (ok.indexOf(origin) >= 0) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Authorization, Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function cleanItems(o) {
  const out = {};
  if (!o || typeof o !== "object" || Array.isArray(o)) return out;
  Object.keys(o).slice(0, MAX_ITEMS).forEach((k) => {
    const e = o[k];
    if (!ID.test(k) || !e || typeof e !== "object" || typeof e.n !== "string" || !/^https?:\/\//i.test(String(e.u || ""))) return;
    const m = +e.m || +e.t || 0;
    if (m > 0) out[k] = Object.assign({}, e, { m });
  });
  return out;
}
function cleanDels(o) {
  const out = {};
  if (!o || typeof o !== "object" || Array.isArray(o)) return out;
  Object.keys(o).slice(0, MAX_DELS).forEach((k) => { const v = +o[k]; if (ID.test(k) && v > 0) out[k] = v; });
  return out;
}
/* newest change per item wins; a removal beats an item that was last changed at or before it */
function merge(a, b) {
  const items = {}, dels = {};
  [a.dels, b.dels].forEach((d) => Object.keys(d).forEach((k) => { if (d[k] > (dels[k] || 0)) dels[k] = d[k]; }));
  [a.items, b.items].forEach((it) => Object.keys(it).forEach((k) => {
    if (dels[k] && it[k].m <= dels[k]) return;
    if (!items[k] || it[k].m > items[k].m) items[k] = it[k];
  }));
  const cut = Date.now() - KEEP_DELS_MS;
  Object.keys(dels).forEach((k) => { if (dels[k] < cut) delete dels[k]; });
  return { items, dels };
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const h = cors(origin, env);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (req.method !== "POST") return new Response("Not found", { status: 404, headers: h });
    if (!env.SYNC_KEY || String(env.SYNC_KEY).length < 16) return new Response("Not set up", { status: 503, headers: h });
    const given = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!same(given, String(env.SYNC_KEY))) return new Response("Unauthorized", { status: 401, headers: h });
    const text = await req.text();
    if (text.length > MAX_BODY) return new Response("Too large", { status: 413, headers: h });
    let j;
    try { j = JSON.parse(text); } catch (e) { return new Response("Bad request", { status: 400, headers: h }); }
    if (!j || typeof j !== "object") return new Response("Bad request", { status: 400, headers: h });
    let stored = { items: {}, dels: {} };
    try {
      const raw = await env.SAVED_KV.get("owner");
      if (raw) { const s = JSON.parse(raw); stored = { items: cleanItems(s.items), dels: cleanDels(s.dels) }; }
    } catch (e) {}
    const out = merge(stored, { items: cleanItems(j.items), dels: cleanDels(j.dels) });
    await env.SAVED_KV.put("owner", JSON.stringify({ items: out.items, dels: out.dels, at: Date.now() }));
    return new Response(JSON.stringify(out), { status: 200, headers: Object.assign({ "Content-Type": "application/json" }, h) });
  }
};
