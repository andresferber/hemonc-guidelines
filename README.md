# Hematology guidelines

Curated, monthly-updated list of guidelines and consensus statements in hematologic malignancies and the supportive fields that shape their care (thrombosis, infection, cardio-oncology, imaging and radiation, transfusion and supportive care, benign hematology in cancer care). Created by Andres Ferber, MD, with the assistance of Claude (Anthropic). For education only.

## How it works
- `tools/entries.py` is the master list (category, display name, organization, PMID or URL, one-line note).
- `python3 tools/build.py` pulls journal, date, DOI and free full-text status from PubMed, PubMed Central and Unpaywall, and writes `guidelines.json`.
- `guidelines.js` builds the accordion (search, "New" badges for the last 6 months, "Most recent on this list", and a live PubMed feed of guideline papers from the last 60 days not yet on the list). Embed on any page:

```html
<div id="hemonc-guidelines"></div>
<script src="https://andresferber.github.io/hemonc-guidelines/guidelines.js"></script>
```

- `index.html` is a standalone page with the same content.
- A monthly scheduled task follows `tools/UPDATE_GUIDE.md`.

Every change is a commit, so earlier versions can always be restored from the history.

## Page ONE link sections (tools, education, calculators)
- `tools/resources.py` is the master list; `python3 tools/build_resources.py` writes `resources.json`.
- `resources.js` builds each section in the same accordion style. Embed one per section:

```html
<div data-hog-section="tools"></div>   <!-- or "edu", or "calc" -->
<script src="https://andresferber.github.io/hemonc-guidelines/resources.js"></script>
```

- `resources.html` previews all three.

## Link check
`.github/workflows/linkcheck.yml` runs `tools/check_links.py` on GitHub on the 3rd of every month (and whenever the lists change). It checks every link in both lists and saves `linkcheck.json`. A link is flagged broken after failing two checks in a row; sites that block automated checks or need a login are recorded as "blocked", not broken. The monthly update (5th) reads `linkcheck.json` and fixes or reports broken links.

## Page ONE search box
`sitesearch.js` searches the guidelines, useful tools, educational resources and calculators together (Page ONE only; it is not connected to the Landmark Trials project). Results open the matching item in its section. Embed:

```html
<div id="hemonc-search"></div>
<script src="https://andresferber.github.io/hemonc-guidelines/sitesearch.js"></script>
```

## Recent papers
`.github/workflows/papers.yml` runs `tools/fetch_papers.py` on GitHub every morning: the latest 20 papers from each source Andres chose (PubMed for Blood, Blood Advances, Cancer Research and JCO; the NEJM hematology/oncology feed; Nature subject feeds for leukemia, lymphomas, myeloma, MPN and MDS), saved in `papers.json`. If a source fails, its previous list is kept. Shown on Page ONE by `resources.js` with `<div data-hog-section="papers"></div>`.

## Hematology images slideshow
`slideshow.js` shows the pictures listed in `slides.json` (file, size, caption) in the Page ONE design: fade, arrows, dots, swipe, pause, and a full-size viewer. Add pictures with `python3 -I tools/add_slides.py <files>`: every picture is re-saved without any metadata (no GPS location, camera or date) and checked before it is added. Embed:

```html
<div id="hemonc-slides"></div>
<script src="https://andresferber.github.io/hemonc-guidelines/slideshow.js"></script>
```

## Weekly digest
`tools/build_digest.py` runs on GitHub every Monday (`.github/workflows/digest.yml`, catch-up on Thursdays) and saves last week's new PubMed papers (Monday to Sunday, by date added to PubMed) for four topics: hematologic malignancies in pregnancy (all journals), AML and MDS, lymphoma, and myeloma (major hematology and oncology journals). One file per week in `digest/`, listed in `digest/index.json`. Each paper shows the authors' own conclusion from the abstract (or the abstract's final sentences, labelled as such); nothing is AI-written. `digest.js` shows it on Page ONE with a week selector, search, and audio (browser speech). Embed:

```html
<div id="hemonc-digest"></div>
<script src="https://andresferber.github.io/hemonc-guidelines/digest.js"></script>
```

## Patient education page
`patient-education.json` lists the patient and family resources (six topics, English and Spanish text, a Spanish address `u_es` where the source has one, tags and diagnosis filters). `patient-education.js` shows it with an English/Español switch, diagnosis buttons and a search box. Its links are part of the monthly link check. Embed:

```html
<div id="patient-education"></div>
<script src="https://andresferber.github.io/hemonc-guidelines/patient-education.js"></script>
```

`patient-education.html` previews it.

## Private marks and sync
"Opened" (Recent papers, Weekly digest) and "Listened" (Weekly digest) marks live only in the reader's browser (localStorage keys `hogRead`, `hogHeard`). "Sync with my other devices" makes a link whose `#hogsync=` hash carries the marked PubMed IDs; opening it on another device merges them there. Nothing is stored on the site. The shared code is `tools/sync_snippet.js`, copied into `resources.js` and `digest.js`.
