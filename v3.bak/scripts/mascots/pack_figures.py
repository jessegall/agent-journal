"""Packs each voice's figure for the viewer: one Draco-compressed glb per voice, named by a hash of its content, and an index naming them.

    blender -b -P pack_figures.py -- --out ../../src/web/public/voices/figures

A file holds one voice alone - the armature, the body its clothes leave showing, and its own wardrobe - so the viewer fetches only the
active voice. The hash in the name is the file's version: a re-exported figure gets a new name, so a cache keyed by the name refreshes
without anyone raising a number. Files of an earlier pack are removed.
"""
import hashlib
import json
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))

from export_rig import write  # noqa: E402
from rig import VOICES, figures  # noqa: E402
from snaps import output_folder  # noqa: E402

INDEX = "figures.json"
HASH_LENGTH = 12


def packed(voice, figure, out):
    """Writes the voice's figure without the body parts its clothes cover and returns the name it is kept under."""
    for part in [part for part in figure.body if part.hide_render]:
        bpy.data.objects.remove(part, do_unlink=True)
    draft = out / f"{voice}.glb"
    write(figure, draft, export_draco_mesh_compression_enable=True)
    named = draft.with_name(f"{voice}.{hashlib.sha256(draft.read_bytes()).hexdigest()[:HASH_LENGTH]}.glb")
    draft.replace(named)
    return named.name


def main():
    out = output_folder()
    index = {voice: packed(voice, figure, out) for voice, figure in figures(VOICES)}
    for old in set(path.name for path in out.glob("*.glb")) - set(index.values()):
        (out / old).unlink()
    (out / INDEX).write_text(json.dumps(index, indent=2) + "\n")
    for voice, name in index.items():
        print(f"{voice}: {name} {(out / name).stat().st_size} bytes")


if __name__ == "__main__":
    main()
