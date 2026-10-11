"""Packs the sprite sheets render_clips.py wrote into the small WebP files the viewer ships.

    python3 pack_sheets.py RENDERED_DIR SHIPPED_DIR

Needs Pillow. SHIPPED_DIR is replaced: it gets manifest.json and <voice>/<clip>/<facing>.webp.
"""
import shutil
import sys
from pathlib import Path

from PIL import Image

QUALITY = 65
ALPHA_QUALITY = 60
SLOWEST_BEST = 6


def pack(rendered, shipped):
    shutil.rmtree(shipped, ignore_errors=True)
    for sheet in sorted(rendered.glob("*/*/*.png")):
        target = shipped / sheet.parent.parent.name / sheet.parent.name / f"{sheet.stem}.webp"
        target.parent.mkdir(parents=True, exist_ok=True)
        Image.open(sheet).save(target, "WEBP", quality=QUALITY, alpha_quality=ALPHA_QUALITY, method=SLOWEST_BEST)
    shutil.copy(rendered / "manifest.json", shipped / "manifest.json")


if __name__ == "__main__":
    pack(Path(sys.argv[1]), Path(sys.argv[2]))
