"""The rig deforms from its bones: every vertex weighted, body shells never stretch, clothes stay on the body under them.

Runs prove_rig.py in Blender once, without renders, and reads its report.
"""
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import proof  # noqa: E402

BLENDER_SECONDS = 600
BONES = {
    "root", "hips", "spine", "chest", "neck", "head",
    "shoulder_l", "upper_arm_l", "forearm_l", "hand_l", "thigh_l", "shin_l", "foot_l",
    "shoulder_r", "upper_arm_r", "forearm_r", "hand_r", "thigh_r", "shin_r", "foot_r",
}
SOFT_SLOTS = {"torso_inner", "torso_middle", "torso_outer", "legs", "feet", "neck_accessory"}
MOST_BONES = 4
LONGEST_EDGE = 1.4
SHORTEST_EDGE = 0.4
GARMENT_DRIFT = 0.3
LEGWEAR_ON_THIGHS = 0.75

needs_blender = pytest.mark.skipif(shutil.which("blender") is None, reason="needs Blender on the path")


def run_blender(script, out, *extra):
    """Runs one of these scripts in Blender with no window, writing into `out`; Blender exits 0 after a script raises unless told not to."""
    subprocess.run(["blender", "-b", "--python-exit-code", "1", "-P", str(HERE / script), "--", "--out", str(out), *extra],
                   check=True, capture_output=True, timeout=BLENDER_SECONDS)


@pytest.fixture(scope="module")
def report(tmp_path_factory):
    out = tmp_path_factory.mktemp("rig")
    run_blender("prove_rig.py", out, "--no-render")
    return proof.load(out / "report.json")


@needs_blender
def test_one_skeleton_of_twenty_bones_on_every_figure(report):
    assert {voice: set(r.bones) for voice, r in report.items()} == {voice: BONES for voice in report}
    assert len(report) == 6


@needs_blender
def test_no_vertex_is_left_without_a_weight(report):
    assert {voice: (r.unweighted, r.worst_sum_error) for voice, r in report.items()} == {voice: (0, 0.0) for voice in report}
    assert max(r.most_bones for r in report.values()) <= MOST_BONES


@needs_blender
def test_body_shells_never_stretch_or_collapse_in_any_pose(report):
    poses = [p.body for r in report.values() for p in r.poses.values()]
    assert sum(p.stretched for p in poses) == 0
    assert max(p.longest for p in poses) < LONGEST_EDGE
    assert min(p.shortest for p in poses) > SHORTEST_EDGE


@needs_blender
def test_clothes_stay_on_the_body_under_them(report):
    drift = [d for r in report.values() for p in r.poses.values() for slot, d in p.garment_drift.items() if slot in SOFT_SLOTS]
    assert max(drift) < GARMENT_DRIFT
    assert report["butler"].legwear_on_thighs > LEGWEAR_ON_THIGHS
