"""Renders every clip of every voice as a lossless sprite sheet; pack_sheets.py turns them into what the viewer ships.

    blender -b -P render_clips.py -- --out DIR [--voices butler,squire] [--clips idle,wave] [--stills]

Writes DIR/manifest.json and DIR/<voice>/<clip>.png; --stills writes one picture per clip, its middle frame, instead.
"""
import json
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))

from clips import CLIPS, Stance  # noqa: E402
from rig import VOICES, Posing, assemble  # noqa: E402
from snaps import render_cell, set_up_render, sheet  # noqa: E402

CELL = (224, 224)
COLUMNS = 8
FRAMED_HEIGHT = 5.4
FRAMED_MIDDLE = 2.4
VOICE_NAMES = ("bare", *VOICES)


def render_frames(figure, stance, clip, folder, only=None):
    """The pictures of one clip, a file per frame; `only` names the one frame to take."""
    camera = bpy.context.scene.camera
    frames = [only] if only is not None else range(clip.frames)
    cells = []
    for frame in frames:
        figure.shut_eyes(1.0)
        clip.pose(Posing(figure.armature), stance, figure, frame / clip.frames)
        cell = folder / f"frame_{clip.name}_{frame:03d}.png"
        render_cell(camera, 0.0, cell)
        cells.append(cell)
    return cells


def manifest_of():
    return {
        "cell": list(CELL),
        "columns": COLUMNS,
        "voices": list(VOICE_NAMES),
        "clips": {clip.name: {"frames": clip.frames, "fps": clip.fps, "loops": clip.loops} for clip in CLIPS.values()},
    }


def main():
    given = sys.argv[sys.argv.index("--") + 1:]
    out = Path(given[given.index("--out") + 1])
    voices = given[given.index("--voices") + 1].split(",") if "--voices" in given else VOICE_NAMES
    names = given[given.index("--clips") + 1].split(",") if "--clips" in given else list(CLIPS)
    stills = "--stills" in given
    out.mkdir(parents=True, exist_ok=True)
    for voice in voices:
        figure = assemble(None if voice == "bare" else voice)
        set_up_render(CELL, height=FRAMED_HEIGHT, centre=FRAMED_MIDDLE, transparent=True)
        stance = Stance.of(figure)
        for name in names:
            clip = CLIPS[name]
            cells = render_frames(figure, stance, clip, out, only=clip.frames // 2 if stills else None)
            folder = out / voice
            folder.mkdir(exist_ok=True)
            sheet(cells, COLUMNS, CELL, folder / (f"{name}_still.png" if stills else f"{name}.png"))
            for cell in cells:
                cell.unlink()
    if not stills:
        (out / "manifest.json").write_text(json.dumps(manifest_of(), indent=1))


main()
