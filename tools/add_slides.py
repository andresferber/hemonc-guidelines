#!/usr/bin/env python3
"""Add pictures to the Page ONE slideshow.
Usage: python3 -I tools/add_slides.py <image> [<image> ...]
Each picture is re-saved as a fresh JPEG (max 1600 px, quality 84) with NO metadata:
EXIF, GPS location, camera, dates, XMP and colour profiles are all dropped. Duplicates of
pictures already in the slideshow are skipped. New entries are appended to slides.json with
an empty caption; fill captions in slides.json ("c")."""
import json, os, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(ROOT, "slides.json")


def ahash(im, n=16):
    g = im.convert("L").resize((n, n))
    px = list(g.getdata()); m = sum(px) / len(px)
    return "".join("1" if p > m else "0" for p in px)


def main(paths):
    slides = json.load(open(JS)) if os.path.exists(JS) else []
    hashes = [ahash(Image.open(os.path.join(ROOT, s["f"]))) for s in slides]
    nxt = max([int(os.path.basename(s["f"])[:2]) for s in slides] or [0]) + 1
    for p in paths:
        im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        im.thumbnail((1600, 1600), Image.LANCZOS)
        h = ahash(im)
        if any(sum(a != b for a, b in zip(h, o)) < 12 for o in hashes):
            print("skip (already in slideshow):", p); continue
        clean = Image.new("RGB", im.size); clean.paste(im)
        fn = "slides/%02d.jpg" % nxt
        clean.save(os.path.join(ROOT, fn), "JPEG", quality=84, optimize=True, progressive=True)
        b = open(os.path.join(ROOT, fn), "rb").read()
        assert b"Exif" not in b and b"GPS" not in b, fn
        slides.append({"f": fn, "w": clean.size[0], "h": clean.size[1], "c": ""})
        hashes.append(h); nxt += 1
        print("added", fn, clean.size)
    json.dump(slides, open(JS, "w"), indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main(sys.argv[1:])
