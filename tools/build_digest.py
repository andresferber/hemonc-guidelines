#!/usr/bin/env python3
"""Weekly digest for Page ONE: new PubMed papers per topic, one file per week.
A week runs Monday to Sunday by PubMed entry date (EDAT). Writes digest/<monday>.json
and digest/index.json. Builds every completed week that is missing (so a missed run is
caught up next time); --weeks N rebuilds the last N completed weeks; --force rebuilds
existing files too.
Summary shown for each paper: the authors' own conclusion from the abstract (labelled
section), or, for unstructured abstracts, the abstract's final sentences, labelled as such.
Nothing is written by AI."""
import argparse, datetime, json, os, re, time, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "digest")
EU = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
UA = "andresferber.org weekly digest (andresferber@hotmail.com)"
KEEP_WEEKS = 52

NOT = ('NOT (comment[pt] OR editorial[pt] OR erratum[pt] OR "published erratum"[pt] OR '
       '"retraction of publication"[pt] OR "retracted publication"[pt] OR news[pt] OR "expression of concern"[pt]) '
       'AND english[la]')
JOURNALS = ('("Blood"[ta] OR "Blood Adv"[ta] OR "J Clin Oncol"[ta] OR "N Engl J Med"[ta] OR "Lancet"[ta] OR '
            '"Lancet Haematol"[ta] OR "Lancet Oncol"[ta] OR "JAMA"[ta] OR "JAMA Oncol"[ta] OR "Nat Med"[ta] OR '
            '"Leukemia"[ta] OR "Haematologica"[ta] OR "Am J Hematol"[ta] OR "Blood Cancer J"[ta] OR '
            '"Br J Haematol"[ta] OR "Hemasphere"[ta] OR "Ann Oncol"[ta] OR "Cancer Discov"[ta] OR '
            '"Clin Cancer Res"[ta] OR "Transplant Cell Ther"[ta] OR "Bone Marrow Transplant"[ta] OR '
            '"Blood Rev"[ta] OR "Nat Rev Clin Oncol"[ta] OR "Cancer"[ta] OR "Leuk Lymphoma"[ta] OR '
            '"Clin Lymphoma Myeloma Leuk"[ta] OR "Hematol Oncol"[ta] OR "Ann Hematol"[ta] OR '
            '"Eur J Haematol"[ta] OR "Cancer Cell"[ta] OR "Nat Commun"[ta] OR "ESMO Open"[ta] OR '
            '"JCO Oncol Pract"[ta] OR "EJHaem"[ta] OR "Lancet Reg Health Eur"[ta])')
HEME_TI = ('(leukemia[ti] OR leukaemia[ti] OR lymphoma*[ti] OR myeloma[ti] OR myelodysplastic[ti] OR '
           'myeloproliferative[ti] OR thrombocythemia[ti] OR "polycythemia vera"[ti] OR myelofibrosis[ti] OR '
           'mastocytosis[ti] OR "hematologic malignan*"[ti] OR "haematological malignan*"[ti] OR '
           '"hematological malignan*"[ti] OR "Hematologic Neoplasms"[majr] OR "Leukemia"[majr] OR '
           '"Lymphoma"[majr] OR "Multiple Myeloma"[majr] OR "Myeloproliferative Disorders"[majr])')
PREG_TI = ('(pregnan*[ti] OR gestation*[ti] OR peripartum[ti] OR postpartum[ti] OR conceiv*[ti] OR '
           '"Pregnancy Complications, Neoplastic"[mh])')

TOPICS = [
    dict(key="preg", title="Hematologic malignancies in pregnancy", sub="All journals",
         q=HEME_TI + " AND " + PREG_TI + ' NOT (childhood[ti] OR "in children"[ti] OR "inhibitory factor"[ti])'),
    dict(key="aml", title="AML and MDS", sub="Major hematology and oncology journals",
         q='("Leukemia, Myeloid, Acute"[majr] OR "acute myeloid leukemia"[ti] OR "acute myeloid leukaemia"[ti] OR '
           'AML[ti] OR "Myelodysplastic Syndromes"[majr] OR myelodysplastic[ti] OR MDS[ti]) AND ' + JOURNALS),
    dict(key="lym", title="Lymphoma", sub="Major hematology and oncology journals",
         q='("Lymphoma"[majr] OR lymphoma*[ti]) AND ' + JOURNALS),
    dict(key="mm", title="Myeloma", sub="Major hematology and oncology journals",
         q='("Multiple Myeloma"[majr] OR myeloma[ti]) AND ' + JOURNALS),
]

TYPE_ORDER = [  # (PubMed publication type, label, key study?)
    ("Practice Guideline", "Guideline", True), ("Guideline", "Guideline", True), ("Consensus Development Conference", "Consensus", True),
    ("Meta-Analysis", "Meta-analysis", True), ("Systematic Review", "Systematic review", True),
    ("Randomized Controlled Trial", "Randomized trial", True), ("Clinical Trial, Phase III", "Phase 3 trial", True),
    ("Clinical Trial, Phase II", "Phase 2 trial", True), ("Clinical Trial, Phase I", "Phase 1 trial", True),
    ("Clinical Trial", "Clinical trial", True), ("Observational Study", "Observational study", False),
    ("Case Reports", "Case report", False), ("Review", "Review", False), ("Letter", "Letter", False),
]
HEUR = [  # (regex on title + start of abstract, label, key study?)
    (r"\b(guideline|consensus|recommendations from)\b", "Guideline", True),
    (r"meta-analy", "Meta-analysis", True), (r"systematic review", "Systematic review", True),
    (r"\brandomi[sz]ed\b.*\b(trial|study)\b|\b(trial|study)\b.*\brandomi[sz]ed\b", "Randomized trial", True),
    (r"phase (iii|3)\b", "Phase 3 trial", True), (r"phase (ii|2)\b", "Phase 2 trial", True),
    (r"phase (i|1)\b", "Phase 1 trial", True),
    (r"case report|a case of\b", "Case report", False),
    (r"\b(retrospective|real-world|cohort|registry|population-based)\b", "Observational study", False),
]
HEUR_METHODS = [h for h in HEUR if h[1] in ("Randomized trial", "Phase 3 trial", "Phase 2 trial", "Phase 1 trial", "Meta-analysis", "Systematic review", "Observational study")]
CONC = re.compile(r"conclu|interpretation|implication|significance|summary", re.I)


def get(url, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:
            err = e
            time.sleep(2 * (i + 1))
    raise err


def week_range(monday):
    return '("%s"[edat] : "%s"[edat])' % (monday.strftime("%Y/%m/%d"), (monday + datetime.timedelta(days=6)).strftime("%Y/%m/%d"))


def text_of(el):
    return re.sub(r"\s+", " ", "".join(el.itertext())).strip() if el is not None else ""


def sentences(t):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+(?=[A-Z(])", t) if s.strip()]


def parse(xml):
    out = {}
    for art in ET.fromstring(xml).iter("PubmedArticle"):
        mc = art.find("MedlineCitation"); a = mc.find("Article")
        pmid = mc.findtext("PMID")
        title = text_of(a.find("ArticleTitle")).rstrip(".")
        j = a.find("Journal")
        journal = (j.findtext("ISOAbbreviation") or j.findtext("Title") or "").strip()
        aus = [x for x in a.findall("AuthorList/Author")]
        def aname(x):
            return (x.findtext("LastName") or x.findtext("CollectiveName") or "") + ((" " + x.findtext("Initials")) if x.findtext("Initials") else "")
        first = (aname(aus[0]) + (" et al." if len(aus) > 1 else "")) if aus else ""
        types = [t.text for t in a.findall("PublicationTypeList/PublicationType")]
        label, key = "", False
        for pt, lb, k in TYPE_ORDER:
            if pt in types:
                label, key = lb, k
                break
        if not label:
            # PubMed often assigns publication types weeks later; infer from the title and first sentences
            # title first; then only the Methods section, which describes this study (not the background)
            meth = " ".join(text_of(x) for x in a.findall("Abstract/AbstractText") if re.search(r"method|design|patients and", x.get("Label") or "", re.I))
            for head, pats in ((title.lower(), HEUR), (meth.lower(), HEUR_METHODS)):
                for pat, lb, k in pats:
                    if re.search(pat, head):
                        label, key = lb, k
                        break
                if label:
                    break
        secs = []
        for at in a.findall("Abstract/AbstractText"):
            lb = at.get("Label") or ""
            secs.append([lb.title() if lb.isupper() else lb, text_of(at)])
        conc, conc_label = "", ""
        for lb, tx in secs:
            if lb and CONC.search(lb):
                conc, conc_label = tx, "Authors’ conclusion"
        if not conc and secs:
            full = " ".join(tx for _, tx in secs)
            ss = sentences(full)
            if len(ss) >= 3:
                conc, conc_label = " ".join(ss[-2:]), "From the abstract (final sentences)"
            elif full:
                conc, conc_label = full, "Abstract"
        ids = {x.get("IdType"): (x.text or "").strip() for x in art.findall("PubmedData/ArticleIdList/ArticleId")}
        edat = ""
        for h in art.findall("PubmedData/History/PubMedPubDate"):
            if h.get("PubStatus") == "entrez":
                edat = "%s-%02d-%02d" % (h.findtext("Year"), int(h.findtext("Month")), int(h.findtext("Day")))
        out[pmid] = dict(p=pmid, t=title, j=journal, a=first, d=edat, ty=label, key=key,
                         c=conc, cl=conc_label, ab=secs if len(" ".join(x[1] for x in secs)) > len(conc) + 40 else [],
                         doi=ids.get("doi", ""), pmc=ids.get("pmc", ""))
    return out


def pmc_live(pmcs):
    live = set()
    today = datetime.date.today().strftime("%Y/%m/%d")
    for i in range(0, len(pmcs), 150):
        try:
            d = json.loads(get(EU + "esummary.fcgi?db=pmc&retmode=json&id=" + ",".join(p.replace("PMC", "") for p in pmcs[i:i + 150])))["result"]
            for k in d.get("uids", []):
                ld = d[k].get("pmclivedate") or ""
                if ld and ld <= today:
                    live.add("PMC" + k)
        except Exception:
            pass
        time.sleep(0.4)
    return live


def build_week(monday):
    rng = week_range(monday)
    topics = []
    allp = {}
    for tp in TOPICS:
        term = "(%s) AND %s %s" % (tp["q"], rng, NOT)
        ids = json.loads(get(EU + "esearch.fcgi?db=pubmed&retmode=json&retmax=200&term=" + urllib.parse.quote(term)))["esearchresult"]["idlist"]
        time.sleep(0.4)
        recs = {}
        for i in range(0, len(ids), 100):
            recs.update(parse(get(EU + "efetch.fcgi?db=pubmed&retmode=xml&id=" + ",".join(ids[i:i + 100]))))
            time.sleep(0.5)
        papers = [recs[i] for i in ids if i in recs and recs[i]["t"]]
        papers.sort(key=lambda x: (not x["key"], "".join(chr(255 - ord(c)) for c in x["d"])))
        for p in papers:
            allp[p["p"]] = p
        topics.append(dict(key=tp["key"], title=tp["title"], sub=tp["sub"], papers=papers))
        print(" ", tp["key"], len(papers))
    live = pmc_live(sorted({p["pmc"] for p in allp.values() if p["pmc"]}))
    for tpc in topics:
        for p in tpc["papers"]:
            p["free"] = p["pmc"] in live
            if not p["free"]:
                p["pmc"] = ""
    sunday = monday + datetime.timedelta(days=6)
    return dict(week=monday.isoformat(), end=sunday.isoformat(),
                built=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC"), topics=topics)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weeks", type=int, default=0)
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    today = datetime.date.today()
    last_monday = today - datetime.timedelta(days=today.weekday() + 7)  # Monday of the last completed week
    # default: catch up any of the last 4 completed weeks that are missing;
    # --weeks N: (re)build the last N completed weeks
    n = a.weeks or 4
    for k in range(n):
        monday = last_monday - datetime.timedelta(weeks=k)
        fn = os.path.join(OUT, monday.isoformat() + ".json")
        if os.path.exists(fn) and not (a.force or a.weeks):
            continue
        print("week", monday)
        json.dump(build_week(monday), open(fn, "w"), ensure_ascii=False, separators=(",", ":"))
    weeks = sorted([f[:-5] for f in os.listdir(OUT) if re.match(r"\d{4}-\d{2}-\d{2}\.json$", f)], reverse=True)[:KEEP_WEEKS]
    idx = []
    for w in weeks:
        d = json.load(open(os.path.join(OUT, w + ".json")))
        idx.append(dict(week=w, end=d["end"], counts={t["key"]: len(t["papers"]) for t in d["topics"]},
                        keys={t["key"]: sum(1 for p in t["papers"] if p["key"]) for t in d["topics"]}))
    json.dump(dict(built=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                   topics=[dict(key=t["key"], title=t["title"], sub=t["sub"]) for t in TOPICS], weeks=idx),
              open(os.path.join(OUT, "index.json"), "w"), ensure_ascii=False, indent=1)
    print(len(idx), "weeks in index")


if __name__ == "__main__":
    main()
