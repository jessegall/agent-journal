"""Poses a clip, turns the figure to each facing, and writes how well the turn kept the pose.

    blender -b -P prove_turn.py -- --out DIR

Writes DIR/turn.json: for each facing, how far any bone strays from where turning the front pose about the vertical axis puts it,
which way the left foot's toe then points, and whether the pose still passes the limits.
"""
import json
import math
import sys
from pathlib import Path

from mathutils import Matrix

sys.path.insert(0, str(Path(__file__).resolve().parent))

from clips import CLIPS, Stance  # noqa: E402
from manifest import FACINGS  # noqa: E402
from rig import BONES, Posing, figures  # noqa: E402
from snaps import output_folder  # noqa: E402

CLIP = "walk"
FRAME = 3


def heads(pose):
    return {spec.name: pose.matrix(spec.name).to_translation() for spec in BONES}


def toe(pose):
    """The direction the left foot bone points in, as (x, y)."""
    direction = pose.matrix("foot_l").to_3x3() @ pose.arm.pose.bones["foot_l"].bone.matrix_local.to_3x3().inverted() @ _rest_toe(pose)
    return [round(direction.x, 3), round(direction.y, 3)]


def _rest_toe(pose):
    bone = pose.arm.data.bones["foot_l"]
    return (bone.tail_local - bone.head_local).normalized()


def posed(figure, facing):
    clip = CLIPS[CLIP]
    pose = Posing(figure.armature)
    clip.pose(pose, Stance.of(figure), figure, FRAME / clip.frames)
    pose.check()
    pose.revolve(facing)
    return pose


def main():
    (_, figure), = figures(["butler"])
    front = heads(posed(figure, 0))
    report = {}
    for facing in FACINGS:
        pose = posed(figure, facing)
        turn = Matrix.Rotation(math.radians(facing), 3, "Z")
        stray = max((heads(pose)[name] - turn @ at).length for name, at in front.items())
        report[str(facing)] = {"stray": round(stray, 5), "toe": toe(pose), "violations": [str(v) for v in pose.violations()]}
    (output_folder() / "turn.json").write_text(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
