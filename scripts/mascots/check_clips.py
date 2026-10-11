"""Runs every clip of every figure through the rig's limits and says which break them.

    blender -b -P check_clips.py -- --out DIR [--voices butler,squire]

Writes DIR/limits.json: for each voice and clip, each bone and motion the clip pushes over, with the worst angle and the most it is over by.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from clips import CLIPS, Stance  # noqa: E402
from rig import Posing  # noqa: E402
from snaps import figures_asked_for, output_folder  # noqa: E402


def rejected(figure, stance, clip):
    """{"bone: motion": {"worst": degrees, "over": degrees, "frames": count}} over every frame of the clip."""
    found = {}
    for frame in range(clip.frames):
        figure.shut_eyes(1.0)
        pose = Posing(figure.armature)
        clip.pose(pose, stance, figure, frame / clip.frames)
        for broken in pose.violations():
            entry = found.setdefault(f"{broken.bone}: {broken.motion}", {"worst": round(broken.angle, 1), "over": round(broken.by, 1), "frames": 0})
            entry["frames"] += 1
            if broken.by > entry["over"]:
                entry["worst"], entry["over"] = round(broken.angle, 1), round(broken.by, 1)
    return found


def main():
    report = {}
    for voice, figure in figures_asked_for():
        stance = Stance.of(figure)
        report[voice] = {name: found for name, clip in CLIPS.items() if (found := rejected(figure, stance, clip))}
    (output_folder() / "limits.json").write_text(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
