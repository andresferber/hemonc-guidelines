#!/usr/bin/env python3
"""Fetch the latest papers for the Page ONE "Recent papers" section; write papers.json.
Runs daily on GitHub (open internet). Same sources Andres chose for the old section:
PubMed for Blood, Blood Advances, Cancer Research (AACR) and JCO; the NEJM
hematology/oncology RSS feed; Nature subject feeds for leukemia, lymphomas, myeloma,
MPN and MDS. If a source fails, its previous list is kept and the error is recorded."""
import datetime, email.utils, html, json, os, re, time, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "papers.json")
UA = "Mozilla/5.0 (compatible; andresferber.org papers feed; contact andresferber@hotmail.com)"
EU = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
N = 20

FEEDS = [
    dict(key="blood", title="Blood: First Edition and latest papers", sub="Blood (ASH)",
         kind="pubmed", term='"Blood"[ta]', home=("Blood First Edition", "https://ashpublications.org/blood/first-edition")),
    dict(key="nejm", title="NEJM hematology and oncology", sub="New England Journal of Medicine",
         kind="rss", url="https://onesearch-rss.nejm.org/api/specialty/rss?context=nejm&specialty=hematology-oncology",
         journal="N Engl J Med", home=("NEJM hematology/oncology", "https://www.nejm.org/medical-articles/hematology-oncology")),
    dict(key="leuk", title="Leukemia", sub="Nature Portfolio journals, subject feed",
         kind="rss", url="https://www.nature.com/subjects/leukaemia.rss", home=("Nature: leukaemia", "https://www.nature.com/subjects/leukaemia")),
    dict(key="nhl", title="Non-Hodgkin lymphoma", sub="Nature Portfolio journals, subject feed",
         kind="rss", url="https://www.nature.com/subjects/non-hodgkin-lymphoma.rss", home=("Nature: non-Hodgkin lymphoma", "https://www.nature.com/subjects/non-hodgkin-lymphoma")),
    dict(key="hl", title="Hodgkin lymphoma", sub="Nature Portfolio journals, subject feed",
         kind="rss", url="https://www.nature.com/subjects/hodgkin-lymphoma.rss", home=("Nature: Hodgkin lymphoma", "https://www.nature.com/subjects/hodgkin-lymphoma")),
    dict(key="mm", title="Myeloma", sub="Nature Portfolio journals, subject feed",
         kind="rss", url="https://www.nature.com/subjects/myeloma.rss", home=("Nature: myeloma", "https://www.nature.com/subjects/myeloma")),
    dict(key="mpn", title="Myeloproliferative neoplasms", sub="Nature Portfolio journals, subject feed",
         kind="rss", url="https://www.nature.com/subjects/myeloproliferative-disease.rss", home=("Nature: myeloproliferative disease", "https://www.nature.com/subjects/myeloproliferative-disease")),
    dict(key="mds", title="Myelodysplastic syndromes", sub="Nature Portfolio journals, subject feed",
         kind="rss", url="https://www.nature.com/subjects/myelodysplastic-syndrome.rss", home=("Nature: myelodysplastic syndrome", "https://www.nature.com/subjects/myelodysplastic-syndrome")),
    dict(key="ba", title="Blood Advances", sub="Blood Advances (ASH)",
         kind="pubmed", term='"Blood Adv"[ta]', home=("Blood Advances", "https://ashpublications.org/bloodadvances")),
    dict(key="aacr", title="AACR online first", sub="Cancer Research (AACR)",
         kind="pubmed", term='"Cancer Res"[ta]', home=("Cancer Research online first", "https://aacrjournals.org/cancerres")),
    dict(key="jco", title="JCO", sub="Journal of Clinical Oncology",
         kind="pubmed", term='"J Clin Oncol"[ta]', home=("JCO", "https://ascopubs.org/journal/jco")),
]
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}


def get(url, accept="*/*", tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read()
        except Exception as e:
            err = e
            time.sleep(2 * (i + 1))
    raise err


def clean(s):
    s = html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()
    return re.sub(r"\s+", " ", s)


def pm_date(x):
    # date the paper appeared online in PubMed (issue dates can lie in the future)
    for h in x.get("history", []):
        if h.get("pubstatus") == "entrez" and h.get("date"):
            return h["date"][:10].replace("/", "-")
    for k in ("epubdate", "pubdate", "sortpubdate"):
        m = re.match(r"(\d{4})(?:[ /]([A-Za-z]{3}|\d{2}))?(?:[ /](\d{1,2}))?", x.get(k) or "")
        if m:
            y, mo, d = m.group(1), m.group(2), m.group(3)
            mo = MON.get(mo, int(mo) if mo and mo.isdigit() else 1)
            return "%s-%02d-%02d" % (y, mo, int(d) if d else 1)
    return ""


def pubmed(feed):
    term = feed["term"] + " NOT (erratum[pt] OR published erratum[pt] OR retraction of publication[pt])"
    q = EU + "esearch.fcgi?db=pubmed&retmode=json&retmax=%d&term=%s" % (N, urllib.parse.quote(term))
    ids = json.loads(get(q))["esearchresult"]["idlist"]
    time.sleep(0.5)
    if not ids:
        return []
    d = json.loads(get(EU + "esummary.fcgi?db=pubmed&retmode=json&id=" + ",".join(ids)))["result"]
    out = []
    for k in d["uids"]:
        x = d[k]
        doi = next((a["value"] for a in x.get("articleids", []) if a["idtype"] == "doi"), "")
        au = x.get("authors") or []
        types = [t for t in x.get("pubtype", []) if t not in ("Journal Article",)]
        out.append(dict(t=clean(x.get("title")).rstrip("."), u=("https://doi.org/" + doi) if doi else "https://pubmed.ncbi.nlm.nih.gov/%s/" % k,
                        p=k, j=x.get("source", ""), d=pm_date(x),
                        a=(au[0]["name"] + (" et al." if len(au) > 1 else "")) if au else "",
                        ty=", ".join(types[:2])))
    return out


NS = {"dc": "http://purl.org/dc/elements/1.1/", "prism": "http://prismstandard.org/namespaces/basic/2.0/",
      "rss1": "http://purl.org/rss/1.0/", "atom": "http://www.w3.org/2005/Atom", "content": "http://purl.org/rss/1.0/modules/content/"}


def rss_date(s):
    s = (s or "").strip()
    if not s:
        return ""
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m:
        return m.group(0)
    try:
        return email.utils.parsedate_to_datetime(s).date().isoformat()
    except Exception:
        return ""


def rss(feed):
    root = ET.fromstring(get(feed["url"], "application/rss+xml,application/xml,text/xml,*/*"))
    items = root.findall(".//item") or root.findall(".//rss1:item", NS) or root.findall(".//atom:entry", NS)
    out = []
    for it in items[:N]:
        def f(*tags):
            for t in tags:
                e = it.find(t, NS)
                if e is not None and (e.text or e.get("href")):
                    return e.text if e.text else e.get("href")
            return ""
        title = clean(f("title", "rss1:title", "atom:title"))
        link = (f("link", "rss1:link", "atom:link") or "").strip()
        link = re.sub(r"\?rss=.*$", "", link)
        date = rss_date(f("pubDate", "dc:date", "prism:publicationDate", "atom:updated", "atom:published"))
        creators = [clean(e.text) for e in it.findall("dc:creator", NS) if e.text]
        if len(creators) == 1 and "," in creators[0]:
            creators = [c.strip() for c in creators[0].split(",")]
        a = (creators[0] + (" et al." if len(creators) > 1 else "")) if creators else ""
        j = clean(f("prism:publicationName", "dc:source")) or feed.get("journal", "")
        doi = clean(f("prism:doi", "dc:identifier")).replace("doi:", "")
        if not link and doi:
            link = "https://doi.org/" + doi
        if title and link:
            out.append(dict(t=title.rstrip("."), u=link, j=j, d=date, a=a))
    return out


def main():
    old = {}
    if os.path.exists(OUT):
        for f in json.load(open(OUT)).get("feeds", []):
            old[f["key"]] = f
    feeds = []
    for fd in FEEDS:
        rec = dict(key=fd["key"], title=fd["title"], sub=fd["sub"], home=fd["home"])
        try:
            items = pubmed(fd) if fd["kind"] == "pubmed" else rss(fd)
            if not items:
                raise ValueError("no items")
            items.sort(key=lambda x: x.get("d") or "", reverse=True)
            rec.update(items=items, updated=datetime.date.today().isoformat())
        except Exception as e:
            prev = old.get(fd["key"], {})
            rec.update(items=prev.get("items", []), updated=prev.get("updated", ""), error=str(e)[:200])
        print(fd["key"], len(rec["items"]), rec.get("error", ""))
        feeds.append(rec)
        time.sleep(0.6)
    json.dump(dict(built=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC"), feeds=feeds),
              open(OUT, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
