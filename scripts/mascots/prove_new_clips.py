"""Native review of the four new clips, using the unchanged rig and assets.

    blender -b -P prove_new_clips.py -- --out DIR

Writes DIR/new_clips.json, then fails on any broken motion contract. This checks
poses, NOT triangle collisions. The project test invokes it; it was not run as
part of the offline authoring pass.
"""
import json
import math
import sys
from pathlib import Path

from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from clips import CLIPS, PULL_GRIP_X, PULL_GRIP_Y, PULL_GRIP_Z, Stance, arms_at_rest, idle, supports_clip  # noqa: E402
from rig import BONES, FIGURES, SIDES, Posing, figures  # noqa: E402
from snaps import output_folder  # noqa: E402

NEW = ("sit_on_edge", "walk_in", "run_in", "pull_ups")
FACINGS = (0, 30, 45, 60, 90, 135, 180, 200, 270, 290, 330)
TOLERANCE = 0.0001


def matrices(pose):
    return {bone.name: pose.matrix(bone.name).copy() for bone in BONES}


def difference(first, second):
    return max(abs(first[name][i][j] - second[name][i][j])
               for name in first for i in range(4) for j in range(4))


def main():
    report = {"voices": list(FIGURES), "clips": list(NEW), "facings": list(FACINGS),
              "failures": [], "samples": 0, "native_blender": True}

    def fail(voice, name, at, detail):
        report["failures"].append({"voice": voice, "clip": name, "t": at, "detail": detail})

    for voice, figure in figures(FIGURES):
        stance = Stance.of(figure)
        for name in NEW:
            clip = CLIPS[name]
            seam = {}
            # Include each displayed frame, its midpoint, and the endpoint.
            for index in range(clip.frames * 2 + 1):
                t = index / (clip.frames * 2)
                figure.shut_eyes(1.0)
                pose = Posing(figure.armature)
                try:
                    clip.pose(pose, stance, figure, t)
                    pose.check()
                except Exception as error:
                    fail(voice, name, t, str(error))
                    continue
                report["samples"] += 1
                if t in (0.0, 1.0):
                    seam[t] = matrices(pose)
                for side in stance.level:
                    normal = pose.delta(f"hand_{side}") @ Vector((0, 0, 1))
                    if (normal - Vector((0, 0, 1))).length > TOLERANCE:
                        fail(voice, name, t, f"{side} level item tilted")
                if name == "pull_ups" and supports_clip(name, stance):
                    for side, sign in SIDES.items():
                        wrist = pose.matrix(f"hand_{side}").to_translation()
                        grip = wrist + pose.delta(f"hand_{side}") @ Vector((sign * 0.26 * math.sqrt(2), 0, 0))
                        target = Vector((sign * PULL_GRIP_X, PULL_GRIP_Y, PULL_GRIP_Z))
                        if (grip - target).length > TOLERANCE:
                            fail(voice, name, t, f"{side} grip drifted")
                if name == "pull_ups" and not supports_clip(name, stance):
                    actual = matrices(pose)
                    expected = Posing(figure.armature)
                    idle(expected, stance, figure, t)
                    if difference(actual, matrices(expected)) > TOLERANCE:
                        fail(voice, name, t, "busy hands did not use the documented idle fallback")
            if clip.loops and set(seam) == {0.0, 1.0} and difference(seam[0.0], seam[1.0]) > TOLERANCE:
                fail(voice, name, 1.0, "loop endpoint mismatch")
            if not clip.loops:
                pose = Posing(figure.armature)
                clip.pose(pose, stance, figure, (clip.frames - 1) / clip.frames)
                actual = matrices(pose)
                resting = Posing(figure.armature)
                arms_at_rest(resting, stance)
                if difference(actual, matrices(resting)) > TOLERANCE:
                    fail(voice, name, (clip.frames - 1) / clip.frames, "last displayed frame is not the relaxed rest pose")
            for facing in FACINGS:
                pose = Posing(figure.armature)
                clip.pose(pose, stance, figure, 0.5)
                pose.revolve(facing)
                for problem in pose.violations():
                    fail(voice, name, 0.5, f"facing {facing}: {problem}")
    (output_folder() / "new_clips.json").write_text(json.dumps(report, indent=2))
    if report["failures"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
