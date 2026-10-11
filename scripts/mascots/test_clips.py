"""The clips: every voice has a sheet for every clip, the sheets fit the manifest, the viewer serves the page, and Blender poses each clip.

The sheets are checked as shipped. One Blender run renders a still of every clip for one voice, so a clip that no longer poses fails here.
"""
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
CLIPS = {"idle", "blink", "nod", "shake", "wave", "think", "celebrate", "sleep", "walk"}
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
        ["blender", "-b", "-P", str(HERE / "render_clips.py"), "--", "--out", str(tmp_path), "--voices", "butler", "--stills"],
        check=True, capture_output=True, timeout=BLENDER_SECONDS,
    )
    assert {p.stem.removesuffix("_still") for p in (tmp_path / "butler").glob("*_still.png")} == CLIPS
