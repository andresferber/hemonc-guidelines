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
