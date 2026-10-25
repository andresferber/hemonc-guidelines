#!/usr/bin/env python3
"""Write resources.json from tools/resources.py (Page ONE tools, education and calculator links)."""
import datetime, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from resources import SECTIONS, TITLES  # noqa: E402

out = {"built": datetime.date.today().isoformat(), "titles": TITLES, "sections": {}}
seen = set()
for sec, panels in SECTIONS.items():
    out["sections"][sec] = []
    for key, title, sub, items in panels:
        for it in items:
            assert it.get("u") or it.get("widget"), it
            seen.add(it.get("u"))
        out["sections"][sec].append({"key": key, "title": title, "sub": sub, "items": items})
with open(os.path.join(os.path.dirname(HERE), "resources.json"), "w") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print({k: sum(len(p["items"]) for p in v) for k, v in out["sections"].items()}, "items")
