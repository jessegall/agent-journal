"""Renders every clip of every voice as a lossless sprite sheet; pack_sheets.py turns them into what the viewer ships.

    blender -b -P render_clips.py -- --out DIR [--voices butler,squire] [--clips idle,wave] [--facings 0,45] [--stills]

Writes DIR/manifest.json and DIR/<voice>/<clip>/<facing>.png, a sheet for each facing (degrees the figure has turned to the viewer's right, all eight by default);
--stills writes one picture per clip and facing, its middle frame, as <facing>_still.png instead.
"""
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))

from clips import CLIPS, Stance  # noqa: E402
from rig import FIGURES, Posing  # noqa: E402
from manifest import FACINGS, ClipInfo, Manifest  # noqa: E402
from snaps import argument, figures_asked_for, has_flag, output_folder, render_cell, set_up_render, sheet  # noqa: E402

CELL = (224, 224)
COLUMNS = 8
FRAMED_HEIGHT = 5.4
FRAMED_MIDDLE = 2.4


def render_frames(figure, stance, clip, folder, facing, only=None):
    """The pictures of one clip with the figure turned to this facing, a file per frame; `only` names the one frame to take."""
    camera = bpy.context.scene.camera
    frames = [only] if only is not None else range(clip.frames)
    cells = []
    for frame in frames:
        figure.shut_eyes(1.0)
        pose = Posing(figure.armature)
        clip.pose(pose, stance, figure, frame / clip.frames)
        pose.check()
        pose.revolve(facing)
        cell = folder / f"frame_{clip.name}_{facing:03d}_{frame:03d}.png"
        render_cell(camera, 0.0, cell)
        cells.append(cell)
    return cells


def manifest_of(facings):
    return Manifest(CELL, COLUMNS, FIGURES, {clip.name: ClipInfo(clip.frames, clip.fps, clip.loops) for clip in CLIPS.values()}, tuple(facings))


def main():
    out = output_folder()
    names = argument("clips", ",".join(CLIPS)).split(",")
    facings = [int(facing) for facing in argument("facings", ",".join(str(facing) for facing in FACINGS)).split(",")]
    stills = has_flag("stills")
    for voice, figure in figures_asked_for():
        set_up_render(CELL, height=FRAMED_HEIGHT, centre=FRAMED_MIDDLE, transparent=True)
        stance = Stance.of(figure)
        for name in names:
            clip = CLIPS[name]
            folder = out / voice / name
            folder.mkdir(parents=True, exist_ok=True)
            for facing in facings:
                cells = render_frames(figure, stance, clip, out, facing, only=clip.frames // 2 if stills else None)
                sheet(cells, COLUMNS, CELL, folder / (f"{facing}_still.png" if stills else f"{facing}.png"))
                for cell in cells:
                    cell.unlink()
    if not stills:
        manifest_of(facings).dump(out / "manifest.json")


main()
