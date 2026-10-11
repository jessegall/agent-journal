"""Reports what the rig did to each voice: its bones, skinned vertices without a weight, and how much of the trousers follow the thighs.

    blender -b -P check_rig.py -- --out report.json
"""
import json
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))

from rig import VOICES, assemble  # noqa: E402

THIGH_BAND = (0.95, 1.30)


def dominant_bone(obj, vertex):
    weights = [(g.weight, obj.vertex_groups[g.group].name) for g in vertex.groups]
    return max(weights)[1] if weights else ""


def skinned(arm):
    return [o for o in bpy.data.objects if o.type == "MESH" and any(m.type == "ARMATURE" and m.object == arm for m in o.modifiers)]


def unweighted(arm):
    return sum(1 for o in skinned(arm) for v in o.data.vertices if not v.groups)


def trousers_on_thighs(arm):
    """Share of the trousers' vertices beside the thighs whose strongest bone is a thigh; None for a voice without trousers."""
    legs = [(o, v) for o in skinned(arm) if "trousers" in o.name or "track_pants" in o.name for v in o.data.vertices if THIGH_BAND[0] < v.co.z < THIGH_BAND[1]]
    if not legs:
        return None
    return sum(dominant_bone(o, v).startswith("thigh") for o, v in legs) / len(legs)


def main():
    given = sys.argv[sys.argv.index("--") + 1:]
    report = {}
    for voice in VOICES:
        figure = assemble(voice)
        report[voice] = {
            "bones": [b.name for b in figure.armature.data.bones],
            "unweighted": unweighted(figure.armature),
            "trousers_on_thighs": trousers_on_thighs(figure.armature),
        }
    Path(given[given.index("--out") + 1]).write_text(json.dumps(report))


main()
