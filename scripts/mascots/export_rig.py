"""Writes each figure's rigged model as a glb, then opens each file again and measures it with prove_rig's own checks.

    blender -b -P export_rig.py -- --out DIR [--voices butler,squire]

Writes DIR/<figure>.glb with the armature, the skin weights and the wardrobe bound to the same bones, and DIR/report.json from the re-opened files.
"""
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))

import proof  # noqa: E402
from prove_rig import measure  # noqa: E402
from rig import Figure, clear_scene, rest  # noqa: E402
from snaps import figures_asked_for, output_folder  # noqa: E402


def write(figure, path):
    rest(figure.armature)
    bpy.ops.export_scene.gltf(filepath=str(path), export_format="GLB", export_skins=True, export_extras=True, export_apply=False)


def reopen(voice, path):
    """The figure as the file holds it: the armature, the body, and the worn pieces its slot marks."""
    clear_scene()
    bpy.ops.import_scene.gltf(filepath=str(path))
    # the importer adds unskinned bone-shape meshes of its own
    meshes = [obj for obj in bpy.data.objects if obj.type == "MESH" and obj.modifiers]
    armature = next(obj for obj in bpy.data.objects if obj.type == "ARMATURE")
    return Figure(voice, armature, [m for m in meshes if "slot" not in m], [m for m in meshes if "slot" in m])


def main():
    out = output_folder()
    reports = {}
    for voice, figure in figures_asked_for():
        path = out / f"{voice}.glb"
        write(figure, path)
        reports[voice] = measure(reopen(voice, path))
        print(f"{voice}: {path.stat().st_size} bytes")
    proof.dump(reports, out / "report.json")


if __name__ == "__main__":
    main()
