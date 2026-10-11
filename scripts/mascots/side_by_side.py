"""One picture per clip and figure that puts a frame of the old sheet beside the same frame of the new one, at the size the chat shows.

    python3 side_by_side.py OLD_COMMIT OUT_DIR

Reads the sheets the viewer ships, now and as they were at OLD_COMMIT, and writes OUT_DIR/<voice>_<clip>.png. Needs Pillow.
"""
import io
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

from manifest import Manifest

REPO = Path(__file__).resolve().parents[2]
SHIPPED = REPO / "src" / "web" / "public" / "mascots"
VOICES = ("butler", "squire")
FRAMES = {"wave": 3, "celebrate": 2}
CHAT_SIZE = 96
LABEL_HEIGHT = 18
GAP = 12
BACKDROP = (232, 233, 237)
INK = (40, 40, 48)


def frame_of(sheet, index, cell, columns):
    row, column = divmod(index, columns)
    picture = sheet.crop((column * cell[0], row * cell[1], (column + 1) * cell[0], (row + 1) * cell[1]))
    backdrop = Image.new("RGBA", picture.size, BACKDROP + (255,))
    backdrop.alpha_composite(picture)
    return backdrop.convert("RGB").resize((CHAT_SIZE, CHAT_SIZE), Image.LANCZOS)


def sheet_at(commit, voice, clip):
    shown = subprocess.run(["git", "show", f"{commit}:src/web/public/mascots/{voice}/{clip}.webp"], cwd=REPO, check=True, capture_output=True).stdout
    return Image.open(io.BytesIO(shown)).convert("RGBA")


def side_by_side(commit, voice, clip, manifest):
    new = Image.open(SHIPPED / voice / f"{clip}.webp").convert("RGBA")
    frames = [frame_of(sheet, FRAMES[clip], manifest.cell, manifest.columns) for sheet in (sheet_at(commit, voice, clip), new)]
    picture = Image.new("RGB", (2 * CHAT_SIZE + 3 * GAP, CHAT_SIZE + LABEL_HEIGHT + 2 * GAP), BACKDROP)
    pen = ImageDraw.Draw(picture)
    for index, (frame, label) in enumerate(zip(frames, ("old", "new"))):
        left = GAP + index * (CHAT_SIZE + GAP)
        picture.paste(frame, (left, GAP))
        pen.text((left + CHAT_SIZE // 2 - 8, GAP + CHAT_SIZE + 3), label, fill=INK)
    return picture


if __name__ == "__main__":
    commit, out = sys.argv[1], Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    manifest = Manifest.load(SHIPPED / "manifest.json")
    for voice in VOICES:
        for clip in FRAMES:
            side_by_side(commit, voice, clip, manifest).save(out / f"{voice}_{clip}.png")
