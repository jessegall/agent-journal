"""Poses the bare robot against its limits and its reach, and writes what happened.

    blender -b -P prove_limits.py -- --out DIR

Writes DIR/limits.json: the limit a wrong pose breaks, whether a right one passes, and how close reaching came to its target.
"""
import json
import sys
from pathlib import Path

from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from clips import hold  # noqa: E402
from prove_rig import evaluated_points  # noqa: E402
from rig import BARE, LIMBS, OutOfLimit, Posing, Unreachable, bone_of, figures  # noqa: E402
from snaps import output_folder  # noqa: E402

NEAR = 0.8


def refused(arm, bone, **turn):
    """The OutOfLimit a single turn of one bone earns, as a plain record; None when the pose is allowed."""
    pose = Posing(arm)
    pose.turn(bone, **turn)
    try:
        pose.check()
    except OutOfLimit as error:
        return {"bone": error.bone, "motion": error.motion, "by": round(error.by, 1)}
    return None


def target_inside(pose, limb, side, way):
    """A point on the limb's own reach, this share of its full length away from the shoulder or hip, along `way`."""
    upper, lower, _ = (bone_of(role, side) for role in LIMBS[limb].roles)
    bones = pose.arm.pose.bones
    full = bones[upper].bone.length + bones[lower].bone.length
    return pose.standing(upper).to_translation() + Vector(way).normalized() * full * NEAR


def reached(arm, limb, side, way):
    pose = Posing(arm)
    target = target_inside(pose, limb, side, way)
    pose.reach(limb, side, target)
    end = {"arm": "hand", "leg": "foot"}[limb]
    return {"miss": round((pose.matrix(bone_of(end, side)).to_translation() - target).length, 4), "violations": [str(v) for v in pose.violations()]}


def middle_of(mesh):
    return Vector(evaluated_points(mesh).mean(axis=0))


def gripped(figure, item, shift):
    """How far a held item's middle ends up from the point its grip was asked to reach: where it sits in the hold, moved by `shift`."""
    hand = next(iter(figure.hands_holding({item})))
    side = hand.removeprefix("hand_")
    mesh = next(worn for worn in figure.worn if worn.get("item") == item)
    hold(Posing(figure.armature), side)
    target = middle_of(mesh) + Vector(shift)
    pose = Posing(figure.armature)
    pose.reach("arm", side, target, grip=figure.grip(item))
    return round((middle_of(mesh) - target).length, 3)


def too_far(arm):
    pose = Posing(arm)
    try:
        pose.reach("arm", "l", Vector((0, 0, 40)))
    except Unreachable as error:
        return {"limb": error.limb, "side": error.side, "by": round(error.by, 1)}
    return None


def main():
    (_, figure), = figures([BARE])
    arm = figure.armature
    (_, butler), = figures(["butler"])
    tray_miss = gripped(butler, "butler_tray", (-0.15, 0.0, 0.15))
    (_, figure), = figures([BARE])
    arm = figure.armature
    report = {
        "elbow_backwards_l": refused(arm, "forearm_l", z=40),
        "elbow_backwards_r": refused(arm, "forearm_r", z=-40),
        "knee_backwards": refused(arm, "shin_l", x=-20),
        "arm_through_body": refused(arm, "upper_arm_l", y=150),
        "arm_through_body_r": refused(arm, "upper_arm_r", y=-150),
        "head_far_round": refused(arm, "head", z=120),
        "elbow_bent_forward": refused(arm, "forearm_l", z=-90),
        "head_turned": refused(arm, "head", z=50),
        "arm_ahead_l": reached(arm, "arm", "l", (0.3, -1.0, -0.3)),
        "arm_ahead_r": reached(arm, "arm", "r", (-0.3, -1.0, -0.3)),
        "leg_forward": reached(arm, "leg", "l", (0.0, -1.0, -0.8)),
        "arm_out_of_range": too_far(arm),
        "tray_miss": tray_miss,
    }
    (output_folder() / "limits.json").write_text(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
