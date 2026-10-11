"""The figure turns to eight facings, 45 degrees apart toward the viewer's right, keeping its pose; the manifest names them in the order of the turn.

One Blender run poses the butler's walk at every facing and writes how well each kept the front pose.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from manifest import FACINGS, ClipInfo, Manifest  # noqa: E402
from test_rig import BLENDER_SECONDS  # noqa: E402

needs_blender = pytest.mark.skipif(shutil.which("blender") is None, reason="needs Blender on the path")


def test_the_facings_go_round_in_steps_of_forty_five_degrees_from_the_front():
    assert FACINGS == (0, 45, 90, 135, 180, 225, 270, 315)


def test_a_manifest_keeps_its_facings_and_one_from_before_the_turn_holds_only_the_front(tmp_path):
    manifest = Manifest((224, 224), 8, ("butler",), {"walk": ClipInfo(12, 12, True)}, FACINGS)
    manifest.dump(tmp_path / "manifest.json")
    assert Manifest.load(tmp_path / "manifest.json").facings == FACINGS
    raw = json.loads((tmp_path / "manifest.json").read_text())
    del raw["facings"]
    (tmp_path / "old.json").write_text(json.dumps(raw))
    assert Manifest.load(tmp_path / "old.json").facings == (0,)


@pytest.fixture(scope="module")
def turned(tmp_path_factory):
    out = tmp_path_factory.mktemp("turn")
    subprocess.run(["blender", "-b", "-P", str(HERE / "prove_turn.py"), "--", "--out", str(out)], check=True, capture_output=True, timeout=BLENDER_SECONDS)
    return json.loads((out / "turn.json").read_text())


@needs_blender
def test_every_facing_is_the_front_pose_turned_about_the_vertical_axis(turned):
    assert list(turned) == [str(facing) for facing in FACINGS]
    assert max(facing["stray"] for facing in turned.values()) < 1e-3
    assert all(facing["violations"] == [] for facing in turned.values())


@needs_blender
def test_the_figure_turns_toward_the_viewers_right(turned):
    front, quarter, back, three_quarters = (turned[str(facing)]["toe"] for facing in (0, 90, 180, 270))
    assert front[1] < -0.9 and quarter[0] > 0.9 and back[1] > 0.9 and three_quarters[0] < -0.9
