"""The clips: every voice has a sheet for every clip, the sheets fit the manifest, the viewer serves the page, and Blender poses each clip.

The sheets are checked as shipped. One Blender run renders a still of every clip for one voice, so a clip that no longer poses fails here.
"""
import ast
import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from manifest import Manifest  # noqa: E402

WEB = HERE.parents[1] / "src" / "web"
BLENDER_SECONDS = 600
NEW_CLIPS = {
    "sit_on_edge": (24, 8, True),
    "walk_in": (40, 12, False),
    "run_in": (28, 12, False),
    "pull_ups": (24, 10, True),
}
# each voice's own way in and out, posed and proved, with no sheets yet: whether they are rendered as sheets waits on sprites or stepped 3D
PASSAGES = {
    "enter": (36, 12, False),
    "exit": (28, 12, False),
}
REGISTERED = NEW_CLIPS | PASSAGES
CLIPS = {"idle", "blink", "nod", "shake", "wave", "think", "celebrate", "sleep", "walk"} | set(NEW_CLIPS)
POSED = CLIPS | set(PASSAGES)
VOICES = {"bare", "butler", "homie", "coach", "colleague", "squire"}

needs_blender = pytest.mark.skipif(shutil.which("blender") is None, reason="needs Blender on the path")


def webp_size(path):
    """The width and height in a webp file's header, whichever of its three kinds it is."""
    head = path.read_bytes()[:32]
    assert head[:4] == b"RIFF" and head[8:12] == b"WEBP", f"{path} is not a webp"
    kind = head[12:16]
    if kind == b"VP8X":
        return 1 + int.from_bytes(head[24:27], "little"), 1 + int.from_bytes(head[27:30], "little")
    if kind == b"VP8L":
        bits = int.from_bytes(head[21:25], "little")
        return 1 + (bits & 0x3FFF), 1 + ((bits >> 14) & 0x3FFF)
    return int.from_bytes(head[26:28], "little") & 0x3FFF, int.from_bytes(head[28:30], "little") & 0x3FFF


@pytest.fixture(scope="module")
def manifest():
    return Manifest.load(WEB / "public" / "mascots" / "manifest.json")


def test_the_manifest_names_every_voice_and_every_clip(manifest):
    assert (set(manifest.voices), set(manifest.clips)) == (VOICES, CLIPS)
    assert all(clip.frames > 1 and clip.fps > 0 for clip in manifest.clips.values())
    assert manifest.clips["idle"].loops and not manifest.clips["nod"].loops


def test_every_voice_has_a_sheet_of_the_right_size_for_every_clip(manifest):
    wrong = {}
    for voice in manifest.voices:
        for name in manifest.clips:
            size = webp_size(WEB / "public" / "mascots" / voice / f"{name}.webp")
            if size != manifest.sheet_size(name):
                wrong[f"{voice}/{name}"] = size
    assert wrong == {}


def test_the_viewer_serves_the_page_and_its_sheets_from_its_own_build():
    page = (WEB / "public" / "mascots.html").read_text()
    assert "mascots/manifest.json" in page and "mascots/${voice}/${clip}.webp" in page
    built = WEB / "dist"
    assert (built / "mascots.html").read_bytes() == (WEB / "public" / "mascots.html").read_bytes()
    assert (built / "mascots" / "manifest.json").read_bytes() == (WEB / "public" / "mascots" / "manifest.json").read_bytes()
    assert sorted(p.relative_to(built).as_posix() for p in (built / "mascots").rglob("*.webp")) == \
        sorted(p.relative_to(WEB / "public").as_posix() for p in (WEB / "public" / "mascots").rglob("*.webp"))


@needs_blender
def test_blender_poses_every_clip_of_a_voice_that_carries_something(tmp_path):
    subprocess.run(
        ["blender", "-b", "-P", str(HERE / "render_clips.py"), "--", "--out", str(tmp_path), "--voices", "butler", "--facings", "0", "--stills"],
        check=True, capture_output=True, timeout=BLENDER_SECONDS,
    )
    assert {p.parent.name for p in (tmp_path / "butler").glob("*/0_still.png")} == POSED


@pytest.mark.parametrize("name, expected", REGISTERED.items())
def test_new_clip_registration_contract(name, expected):
    """Read the real registration without importing Blender into pytest."""
    tree = ast.parse((HERE / "clips.py").read_text())
    found = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "Clip":
            clip_name, frames, fps, loops = (ast.literal_eval(arg) for arg in node.args[:4])
            assert clip_name not in found, f"duplicate clip {clip_name}"
            found[clip_name] = (frames, fps, loops)
            assert isinstance(node.args[4], ast.Name) and node.args[4].id == clip_name
    assert set(found) == POSED
    assert found[name] == expected


@pytest.mark.parametrize("name, expected", NEW_CLIPS.items())
def test_new_clip_manifest_contract(manifest, name, expected):
    clip = manifest.clips[name]
    assert (clip.frames, clip.fps, clip.loops) == expected


@pytest.mark.parametrize("name, expected", REGISTERED.items())
def test_new_clip_browser_contract(name, expected):
    frames, fps, loops = expected
    page = (HERE / "stepped" / "figure.js").read_text()
    entry = f'{{name: "{name}", frames: {frames}, fps: {fps}, loops: {str(loops).lower()}, pose: {name}}}'
    assert entry in page


@needs_blender
def test_new_clip_animation_contracts_in_blender(tmp_path):
    """Native limits, empty-hand gate, fixed grips, level props, seams and endpoints.

    Kept separate from rendering; the numerical contract does not certify mesh
    collision freedom or replace stepping the clip in the viewer.
    """
    subprocess.run(
        ["blender", "-b", "-P", str(HERE / "prove_new_clips.py"), "--", "--out", str(tmp_path)],
        check=True, capture_output=True, timeout=BLENDER_SECONDS,
    )
    report = json.loads((tmp_path / "new_clips.json").read_text())
    assert report["failures"] == []
    assert set(report["voices"]) == VOICES
    assert set(report["clips"]) == set(NEW_CLIPS)
    assert report["facings"] == [0, 30, 45, 60, 90, 135, 180, 200, 270, 290, 330]


@needs_blender
def test_every_voice_enters_onto_idle_and_exits_from_it_in_blender(tmp_path):
    """Each voice's own entrance and exit: inside the limits on every frame, joined to idle without a jump, starting or ending out of sight."""
    subprocess.run(
        ["blender", "-b", "-P", str(HERE / "prove_passages.py"), "--", "--out", str(tmp_path)],
        check=True, capture_output=True, timeout=BLENDER_SECONDS,
    )
    report = json.loads((tmp_path / "passages.json").read_text())
    assert report["failures"] == []
    assert (set(report["voices"]), set(report["clips"])) == (VOICES, set(PASSAGES))
