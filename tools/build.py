#!/usr/bin/env python3
"""Build guidelines.json from tools/entries.py.
Fetches PubMed metadata (journal, date, DOI, PMCID, article title) for every entry
with a PMID and checks Unpaywall for a legal free copy. Prints a check table so the
display name can be compared with the PubMed title.
Usage: python3 tools/build.py [--no-unpaywall]"""
import json, os, re, sys, time, urllib.parse, urllib.request, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from entries import CATS, E  # noqa: E402

EU = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
EMAIL = "andresferber@hotmail.com"
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}


def get(url, tries=4):
    for i in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                return json.loads(r.read().decode())
        except Exception:
            time.sleep(1.5 * (i + 1))
    return None


def ym(s):
    """'2026 Sep 30' -> '2026-09'; '2025' -> '2025'."""
    if not s:
        return ""
    m = re.match(r"(\d{4})(?:\s+([A-Za-z]{3}))?", s)
    if not m:
        return ""
    y, mo = m.group(1), m.group(2)
    return f"{y}-{MON[mo]:02d}" if mo in MON else y


def main():
    use_up = "--no-unpaywall" not in sys.argv
    keys = [e["k"] for e in E]
    dup = {k for k in keys if keys.count(k) > 1}
    if dup:
        sys.exit(f"duplicate keys: {dup}")
    cats = {c for c, _, _ in CATS}
    for e in E:
        if e["c"] not in cats:
            sys.exit(f"unknown category {e['c']} in {e['k']}")

    pmids = sorted({e["p"] for e in E if e.get("p")})
    meta = {}
    for i in range(0, len(pmids), 150):
        d = get(EU + "esummary.fcgi?db=pubmed&retmode=json&id=" + ",".join(pmids[i:i + 150]))
        for k in d["result"]["uids"]:
            x = d["result"][k]
            ids = {a["idtype"]: a["value"] for a in x.get("articleids", [])}
            dates = [ym(x.get("epubdate")), ym(x.get("pubdate"))]
            dates = [t for t in dates if t]
            meta[k] = dict(
                title=x.get("title", "").rstrip("."),
                journal=x.get("source", ""),
                date=min(dates) if dates else "",
                cite=f"{x.get('source','')} {x.get('pubdate','')[:4]};{x.get('volume','')}{'(' + x['issue'] + ')' if x.get('issue') else ''}:{x.get('pages','')}".rstrip(":;"),
                doi=ids.get("doi", ""),
                pmc=ids.get("pmc", ""),
                au=(x["authors"][0]["name"] if x.get("authors") else ""),
            )
        time.sleep(0.4)

    # PMC copies: only count as free once live (author manuscripts can be embargoed)
    today = datetime.date.today().strftime("%Y/%m/%d")
    pmcs = [m["pmc"].replace("PMC", "") for m in meta.values() if m["pmc"]]
    live = {}
    for i in range(0, len(pmcs), 150):
        d = get(EU + "esummary.fcgi?db=pmc&retmode=json&id=" + ",".join(pmcs[i:i + 150]))
        for k in (d or {}).get("result", {}).get("uids", []):
            live["PMC" + k] = d["result"][k].get("pmclivedate") or ""
        time.sleep(0.4)
    for m in meta.values():
        if m["pmc"] and not (live.get(m["pmc"]) and live[m["pmc"]] <= today):
            m["pmc_embargo"] = True

    out = []
    print(f"{'key':22} {'date':8} {'journal':24} PubMed title")
    for e in E:
        r = {k: v for k, v in e.items()}
        if e.get("p"):
            m = meta.get(e["p"])
            if not m:
                sys.exit(f"PMID {e['p']} ({e['k']}) not found")
            r.update(t=m["title"], j=m["journal"], d=m["date"], cite=m["cite"], doi=m["doi"], pmc=m["pmc"], au=m["au"])
            if m["pmc"] and not m.get("pmc_embargo"):
                r["free"] = "pmc"
            elif use_up and m["doi"]:
                u = get("https://api.unpaywall.org/v2/" + urllib.parse.quote(m["doi"]) + "?email=" + EMAIL, tries=2)
                loc = (u or {}).get("best_oa_location") or {}
                if loc.get("host_type") == "publisher":
                    r["free"] = "publisher"
                elif loc.get("host_type") == "repository":
                    url = loc.get("url_for_pdf") or loc.get("url") or ""
                    if url and "pubmed" not in url and "doi.org" not in url:
                        r["free"] = "repo"
                        r["repo"] = url
                time.sleep(0.2)
            print(f"{e['k'][:22]:22} {r['d']:8} {r['j'][:24]:24} {m['title'][:110]}")
        out.append(r)

    try:
        dismissed = json.load(open(os.path.join(HERE, "dismissed.json"))).get("dismissed", [])
    except Exception:
        dismissed = []
    data = dict(
        built=datetime.date.today().isoformat(),
        dismissed=dismissed,
        categories=[dict(key=c, title=t, sub=s) for c, t, s in CATS],
        entries=out,
    )
    with open(os.path.join(ROOT, "guidelines.json"), "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"\n{len(out)} entries written to guidelines.json")


if __name__ == "__main__":
    main()
