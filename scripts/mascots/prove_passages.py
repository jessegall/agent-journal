"""Each voice's own entrance and exit held to their contract, using the unchanged rig and assets.

    blender -b -P prove_passages.py -- --out DIR

Writes DIR/passages.json, then fails on any broken contract: every displayed frame poses inside the limits; an entrance's last frame
is idle's first and an exit's first frame is idle's first, so the clips join without a jump; a passage that walks starts or ends off
the picture's side, and the homie, who climbs up past the chat box's edge and drops down past it, is wholly below that edge at his
entrance's start and his exit's end. This checks poses, NOT triangle collisions.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from clips import CLIPS, ENTRANCES, Stance, idle  # noqa: E402
from prove_new_clips import difference, matrices  # noqa: E402
from rig import FIGURES, HEAD_TOP, Posing, figures  # noqa: E402
from render_clips import FRAMED_HEIGHT  # noqa: E402
from snaps import output_folder  # noqa: E402

PASSAGES = ("enter", "exit")
CLIMBS = {"homie"}
TOLERANCE = 0.0001
# a root this far to the side has the whole figure, arms and head included, outside the picture
OFF_THE_SIDE = FRAMED_HEIGHT / 2 + 1.0


def posed(figure, stance, clip, frame):
    figure.shut_eyes(1.0)
    pose = Posing(figure.armature)
    clip.pose(pose, stance, figure, frame / clip.frames)
    return pose


def out_of_sight(voice, pose, armature):
    """Whether the figure is outside the picture: past its side, or for a voice that climbs, below the box's edge, the top of the head included."""
    if voice in CLIMBS:
        head = pose.matrix("head").to_translation().z
        return head + HEAD_TOP - armature.data.bones["head"].head_local.z < 0.0
    return abs(pose.matrix("root").to_translation().x) > OFF_THE_SIDE


def main():
    report = {"voices": list(FIGURES), "clips": list(PASSAGES), "failures": [], "frames": 0}

    def fail(voice, name, frame, detail):
        report["failures"].append({"voice": voice, "clip": name, "frame": frame, "detail": detail})

    for voice, figure in figures(FIGURES):
        assert voice in ENTRANCES, f"{voice} has no entrance of its own"
        stance = Stance.of(figure)
        resting = Posing(figure.armature)
        idle(resting, stance, figure, 0.0)
        at_rest = matrices(resting)
        for name in PASSAGES:
            clip = CLIPS[name]
            for frame in range(clip.frames):
                try:
                    pose = posed(figure, stance, clip, frame)
                    pose.check()
                except Exception as error:
                    fail(voice, name, frame, str(error))
                    continue
                report["frames"] += 1
            joined, hidden = (clip.frames - 1, 0) if name == "enter" else (0, clip.frames - 1)
            if difference(matrices(posed(figure, stance, clip, joined)), at_rest) > TOLERANCE:
                fail(voice, name, joined, "does not join idle's first frame")
            if not out_of_sight(voice, posed(figure, stance, clip, hidden), figure.armature):
                fail(voice, name, hidden, "is still in sight where it should be out of it")
    (output_folder() / "passages.json").write_text(json.dumps(report, indent=2))
    if report["failures"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
