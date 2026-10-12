"""A pose is judged against what each bone may do, and a limb reaches a point by solving its own angles.

Two Blender runs: prove_limits.py poses the bare robot, check_clips.py runs every shipped clip through the limits.
"""
import json
import shutil
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from test_clips import VOICES  # noqa: E402
from test_rig import run_blender  # noqa: E402

REACH_TOLERANCE = 1e-3
GRIP_TOLERANCE = 0.02

needs_blender = pytest.mark.skipif(shutil.which("blender") is None, reason="needs Blender on the path")


def blender(script, out, *extra):
    run_blender(script, out, *extra)
    return json.loads((out / "limits.json").read_text())


@pytest.fixture(scope="module")
def proved(tmp_path_factory):
    return blender("prove_limits.py", tmp_path_factory.mktemp("limits"))


@pytest.fixture(scope="module")
def surveyed(tmp_path_factory):
    return blender("check_clips.py", tmp_path_factory.mktemp("survey"), "--voices", ",".join(sorted(VOICES)))


@needs_blender
def test_a_pose_outside_a_limit_is_refused_by_bone_and_motion(proved):
    assert proved["elbow_backwards_l"]["bone"] == "forearm_l" and proved["elbow_backwards_r"]["bone"] == "forearm_r"
    assert proved["knee_backwards"]["motion"] == "bend direction"
    assert (proved["arm_through_body"]["by"], proved["arm_through_body_r"]["by"]) == (60.0, 60.0)
    assert (proved["head_far_round"]["bone"], proved["head_far_round"]["by"]) == ("head", 40.0)


@needs_blender
def test_a_pose_inside_the_limits_is_allowed(proved):
    assert proved["elbow_bent_forward"] is None and proved["head_turned"] is None


@needs_blender
def test_a_limb_reaches_its_target_and_stays_inside_its_limits(proved):
    for reach in ("arm_ahead_l", "arm_ahead_r", "leg_forward"):
        assert proved[reach]["miss"] < REACH_TOLERANCE and proved[reach]["violations"] == []


@needs_blender
def test_a_held_item_ends_up_at_the_grip_asked_for(proved):
    assert proved["tray_miss"] < GRIP_TOLERANCE


@needs_blender
def test_a_target_out_of_range_is_refused_with_how_far_off(proved):
    assert proved["arm_out_of_range"] == {"limb": "arm", "side": "l", "by": pytest.approx(36.9, abs=0.2)}


@needs_blender
def test_every_shipped_clip_passes_the_limits_on_every_figure(surveyed):
    assert {voice: clips for voice, clips in surveyed.items() if clips} == {}
