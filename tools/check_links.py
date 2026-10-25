#!/usr/bin/env python3
"""Check every link in guidelines.json and resources.json; write linkcheck.json.
Runs in GitHub Actions (open internet). A link counts as broken only after it fails on two
consecutive checks, so a site that is briefly down does not raise an alarm. 401/403/429
mean the site blocks automated checks or needs a login: recorded as "blocked", not broken."""
import concurrent.futures as cf, datetime, json, os, urllib.request, urllib.error, ssl, socket

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"


def collect():
    links = {}
    g = json.load(open(os.path.join(ROOT, "guidelines.json")))
    for e in g["entries"]:
        where = "guidelines: " + e["k"]
        if e.get("u"): links.setdefault(e["u"], where)
        if e.get("p"): links.setdefault("https://pubmed.ncbi.nlm.nih.gov/%s/" % e["p"], where)
        if e.get("free") == "pmc": links.setdefault("https://pmc.ncbi.nlm.nih.gov/articles/%s/" % e["pmc"], where)
        elif e.get("doi"): links.setdefault("https://doi.org/" + e["doi"], where)
        if e.get("repo"): links.setdefault(e["repo"], where)
    r = json.load(open(os.path.join(ROOT, "resources.json")))
    for sec, panels in r["sections"].items():
        for p in panels:
            for it in p["items"]:
                where = "%s / %s: %s" % (sec, p["title"], it["n"])
                if it.get("u"): links.setdefault(it["u"], where)
                if it.get("ref"): links.setdefault(it["ref"][1], where)
    return links


def check(url):
    ctx = ssl.create_default_context()
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
        try:
            with urllib.request.urlopen(req, timeout=25, context=ctx) as resp:
                return {"code": resp.status, "final": resp.geturl()}
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (400, 403, 404, 405, 406, 429, 500, 501, 503):
                continue
            return {"code": e.code}
        except ssl.SSLError as e:
            return {"code": 0, "err": "TLS: %s" % e}
        except (urllib.error.URLError, socket.timeout, ConnectionError) as e:
            if method == "HEAD":
                continue
            return {"code": 0, "err": str(getattr(e, "reason", e))[:160]}
    return {"code": 0, "err": "no response"}


def moved_home(url, final):
    from urllib.parse import urlparse
    a, b = urlparse(url), urlparse(final or url)
    return bool(final) and len(a.path.strip("/")) > 0 and b.path.strip("/") == "" and not b.query


def status(res, url=""):
    c = res["code"]
    if 200 <= c < 400 and moved_home(url, res.get("final")): return "fail"
    if 200 <= c < 400: return "ok"
    if c in (401, 403, 429, 999): return "blocked"
    return "fail"


def main():
    links = collect()
    old_path = os.path.join(ROOT, "linkcheck.json")
    old = json.load(open(old_path))["links"] if os.path.exists(old_path) else {}
    out = {}
    with cf.ThreadPoolExecutor(8) as ex:
        for url, res in zip(links, ex.map(check, links)):
            st = status(res, url)
            prev = old.get(url, {})
            fails = prev.get("fails", 0) + 1 if st == "fail" else 0
            out[url] = dict(where=links[url], status=st, code=res["code"], fails=fails,
                            broken=fails >= 2, **({"err": res["err"]} if res.get("err") else {}),
                            **({"final": res["final"]} if res.get("final") and res["final"] != url else {}))
    summary = {s: sum(1 for v in out.values() if v["status"] == s) for s in ("ok", "blocked", "fail")}
    summary["broken"] = sum(1 for v in out.values() if v["broken"])
    json.dump({"checked": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"), "summary": summary, "links": out},
              open(old_path, "w"), indent=1, ensure_ascii=False)
    print(summary)
    for u, v in out.items():
        if v["status"] != "ok":
            print(v["status"], v["code"], v.get("err", ""), u, "|", v["where"])


if __name__ == "__main__":
    main()
