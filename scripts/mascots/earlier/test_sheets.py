"""The rig and the sheets it renders: one armature on every voice, clothes that follow the legs, strips the viewer reads."""
import json
import shutil
import struct
import subprocess
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
PACKED = HERE.parents[1] / "src" / "install.py"
CELL = 256
BLENDER_SECONDS = 600
CHECK = HERE / "check_rig.py"

needs_blender = pytest.mark.skipif(shutil.which("blender") is None, reason="needs Blender on the path")


def png_size(path):
    header = path.read_bytes()[:24]
    return struct.unpack(">II", header[16:24])


def test_the_meshes_stay_out_of_the_install():
    source = PACKED.read_text()
    assert '"scripts"' not in source.split("PACKED_DIRS", 1)[1].split("\n", 3)[0]
    assert "scripts/" not in source.split("PACKAGE_TREES", 1)[1].split("\n", 1)[0]


@needs_blender
def test_one_rig_binds_every_voice_and_the_clothes_follow_the_legs(tmp_path):
    report = tmp_path / "rig.json"
    subprocess.run(["blender", "-b", "-P", str(CHECK), "--", "--out", str(report)], check=True, capture_output=True, timeout=BLENDER_SECONDS)
    voices = json.loads(report.read_text())
    assert {len(v["bones"]) for v in voices.values()} == {22}
    assert all(v["unweighted"] == 0 for v in voices.values())
    assert voices["butler"]["trousers_on_thighs"] > 0.9
    assert voices["coach"]["trousers_on_thighs"] > 0.9


@needs_blender
def test_a_clip_renders_as_a_strip_of_square_cells_named_for_the_viewer(tmp_path):
    subprocess.run(
        ["blender", "-b", "-P", str(HERE / "render_sheets.py"), "--", "--voices", "butler", "--clips", "blink", "--out", str(tmp_path), "--size", "512"],
        check=True, capture_output=True, timeout=BLENDER_SECONDS,
    )
    sheet = tmp_path / "butler_idle_blinking_sheet.png"
    width, height = png_size(sheet)
    assert height == CELL
    assert width % CELL == 0 and width // CELL == 6
