# Monthly update procedure (Guidelines section)

The scheduled task follows this guide. Goal: keep `guidelines.json` current with new and
updated guidelines in hematologic malignancies and the supportive fields that shape their
care (thrombosis, infection, cardio-oncology, imaging, radiation, transfusion, supportive
care, fertility and pregnancy, benign hematology relevant to cancer care).

## Standing rules
- Independent project of Andres Ferber, MD: no links to his employer and no preference for
  any institution's publications.
- Pharma-bias rule: no company-produced education, advertising or press releases as
  sources; generic drug names in notes. Industry-authored papers are fine.
- Sources: official society guidelines and peer-reviewed consensus statements only (ASH,
  ASCO, ESMO, EHA, ELN, IMWG/IMS, EMN, iwCLL, EBMT, ASTCT, NIH, ECIL, IDSA, ESC, AHA/ACC,
  CHEST, ISTH, AABB/ICTMG, BSH, NCCN Insights and comparable bodies). Not narrative reviews,
  surveys, adherence studies, pediatric-only, case series or "how I treat" articles.
- Every note is one line, in our own words, factual (what the guideline covers), no verdicts.
- Contact address on the page: andresferber@hotmail.com only.

## Steps
1. Clone the repo. Read `tools/entries.py` (the master list) and this guide.
2. Find candidates published since the last `built` date in `guidelines.json`, minus 2 weeks:
   - PubMed (eutils, ~0.4 s between calls): guideline/practice guideline/consensus
     publication types, or "guideline", "recommendation", "consensus" in the title, in
     the topic areas above (the live-feed query in `guidelines.js` is a good start; also
     run it for each category's topics).
   - WebSearch for new versions announced by ASH, ASCO, ESMO, EHA, ELN, IMWG, NCCN, ECIL,
     ESC, IDSA (a society page or the journal article, never a press release as the source).
   - ASCO living guidelines (myeloma): take the newest version and update `asco-mm-living`'s PMID.
3. For each candidate decide: new entry, replacement of an existing entry, or skip.
   - Replacement (same body, same topic, newer version): add the new entry and mark the old
     one `old=True` (shown as "Earlier version", greyed, at the bottom of its group) with
     `prev="<old key>"` on the new one. After about 12 months, remove the old entry.
   - Keep each category focused: when a category exceeds ~25 entries, retire older items
     that are fully superseded.
4. Verify every new PMID: title, journal, first author and that it is the guideline itself
   (not a commentary, summary or erratum). Read the abstract before writing the note.
5. Add any skipped PubMed IDs that the live feed keeps showing (e.g. pediatric, regional,
   not relevant) to `dismissed` in `tools/dismissed.json` so the live feed hides them.
6. Run `python3 tools/build.py`. Check the printed table: every display name must match its
   PubMed title. Check that society-portal links still resolve (WebFetch or WebSearch).
7. `node --check guidelines.js`; render `index.html` in Playwright (all panels open, search,
   live feed, phone width, no page errors other than font loading).
8. Commit (Claude <noreply@anthropic.com>, with the session attribution trailers),
   `git pull --rebase`, push. Retry a failed push up to 3 times.
9. Keep the pinned quick links (`pin=` in entries.py: NCCN, ASH VTE guidelines) unless Andres asks to change them.
10. Broken links: read `linkcheck.json` (written on the 3rd by the GitHub link check). For each
   entry with `broken: true`, in guidelines or in `tools/resources.py`: find the current address
   of the same resource (WebSearch; the publisher's or owner's own site) and update it, or, if
   the resource no longer exists, list it for Andres instead of deleting it. Then run
   `python3 tools/build_resources.py`. Links in `tools/resources.py` were chosen by Andres: never
   add or remove one without asking; only repair addresses. The Jefferson links there are kept
   by his choice.
11. Summary for Andres (include links repaired and links that need his decision): entries added, replaced, retired, and candidates skipped with a reason.
   Never apply content changes that need his judgment (removing a whole category, adding a
   new category) without asking; list them as questions instead.
