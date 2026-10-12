"""The exported glb files hold the same rig the code builds: re-opened, they pass the same checks as test_rig.

Runs export_rig.py in Blender once and reads its report; the checks are test_rig's own.
"""
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import proof  # noqa: E402
from test_rig import (  # noqa: E402,F401
    run_blender,
    test_body_shells_never_stretch_or_collapse_in_any_pose,
    test_clothes_stay_on_the_body_under_them,
    test_no_vertex_is_left_without_a_weight,
    test_one_skeleton_of_twenty_bones_on_every_figure,
)


@pytest.fixture(scope="module")
def report(tmp_path_factory):
    out = tmp_path_factory.mktemp("export")
    run_blender("export_rig.py", out)
    assert len(list(out.glob("*.glb"))) == 6
    return proof.load(out / "report.json")
