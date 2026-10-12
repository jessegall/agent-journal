"""The exported glb files hold the same rig the code builds: re-opened, they pass the same checks as test_rig.

Runs export_rig.py in Blender once and reads its report; the checks are test_rig's own.
"""
import hashlib
import json
import struct
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import proof  # noqa: E402
from test_rig import (  # noqa: E402,F401
    needs_blender,
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


def glb_json(path):
    """The JSON chunk of a glb file: its nodes, meshes and the extensions it uses."""
    data = path.read_bytes()
    length = struct.unpack("<I", data[12:16])[0]
    return json.loads(data[20:20 + length])


@needs_blender
def test_each_voice_is_packed_alone_under_the_hash_of_its_content(tmp_path):
    """The viewer fetches one voice's figure only, and its file name changes whenever its content does."""
    run_blender("pack_figures.py", tmp_path)
    index = json.loads((tmp_path / "figures.json").read_text())
    assert set(index) == {"butler", "homie", "coach", "colleague", "squire"}
    assert sorted(path.name for path in tmp_path.glob("*.glb")) == sorted(index.values())
    for voice, name in index.items():
        packed = tmp_path / name
        assert name == f"{voice}.{hashlib.sha256(packed.read_bytes()).hexdigest()[:12]}.glb"
        content = glb_json(packed)
        assert "KHR_draco_mesh_compression" in content["extensionsUsed"]
        worn = {node["extras"]["item"] for node in content["nodes"] if "item" in node.get("extras", {})}
        assert worn and all(item.startswith(f"{voice}_") for item in worn)
