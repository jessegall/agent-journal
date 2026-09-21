import features
import struct
import subprocess
import sys

from pathlib import Path
from types import SimpleNamespace
from controllers.types import Messages
from features.attachments import feature
from resources.base import USER
from tests.conftest import fresh
from controllers.types import Agents, Messages, Nudges
from commands.cli import search_text
from commands.http import dispatch
from resources.base import SYSTEM, USER
from tests.conftest import fresh, refused


def test_clip_length_decides_the_sampling_spacing():
    assert feature.spacing(12) == 0.5, "short clips are sampled twice a second"
    assert feature.spacing(90) == 2, "medium clips are sampled every two seconds"
    assert feature.spacing(600) == 10, "long clips stay under sixty frames"


def test_an_attached_video_is_sampled_into_frames_the_agent_can_inspect(tmp_path):
    called = []
    run = feature.subprocess.run
    which = feature.shutil.which

    def fake_run(command, **kwargs):
        called.append(command)
        if command[0] == "ffprobe":
            return SimpleNamespace(returncode=0, stdout="12.0\n", stderr="")
        pattern = Path(command[-1])
        for n in (1, 2):
            Path(str(pattern).replace("%04d", f"{n:04d}")).write_bytes(b"jpg")
        return SimpleNamespace(returncode=0, stdout="", stderr="")

    feature.subprocess.run = fake_run
    feature.shutil.which = lambda name: f"/usr/bin/{name}"
    try:
        record = fresh()
        messages = Messages(record, actor=USER)
        message = messages.create("look at this clip")
        source = tmp_path / "walkthrough.mp4"
        source.write_bytes(b"video")
        messages.attach(message.n, str(source))
        row = messages.load(message.n)
        assert row.files == {
            "walkthrough.mp4": "video; 2 frames every 0.5 seconds",
            "walkthrough-mp4-frame-0001.jpg": "video frame from walkthrough.mp4",
            "walkthrough-mp4-frame-0002.jpg": "video frame from walkthrough.mp4",
        }, "the video points the agent at its sampled frames"
        assert [command[0] for command in called] == ["ffprobe", "ffmpeg"], "ffprobe and ffmpeg each run once"
        assert called[1][called[1].index("-frames:v") + 1] == str(feature.MAX_FRAMES), "ffmpeg caps the number of frames"
    finally:
        feature.subprocess.run = run
        feature.shutil.which = which


HERE = Path(__file__).resolve().parents[2]


def test_an_uploaded_image_is_nudged_for_tags_and_the_cli_tag_command_files_and_finds_them(tmp_path):
    record = fresh()
    Agents(record, actor=SYSTEM).create("session", status="working")
    messages = Messages(record, actor=USER)
    message = messages.create("look at this")
    folder = tmp_path
    image = folder / "dashboard.png"
    image.write_bytes(b"png")
    messages.attach(message.n, str(image))

    nudges = Nudges(record, actor=SYSTEM).all()
    assert (len(nudges), nudges[0].title) == (1, "message 1 file dashboard.png needs tags"), \
        "an uploaded image asks the agent for tags"
    tagged = subprocess.run(
        [sys.executable, str(HERE / "journal.py"), "--root", str(record.root), "--env", record.env,
         "message", "tag", str(message.n), image.name, "deployment graph with three regions"],
        capture_output=True, text=True, timeout=20,
    )
    assert tagged.returncode == 0, "the feature's instructed CLI command tags the attachment"
    assert messages.load(message.n).files[image.name] == "deployment graph with three regions", "tags live on the file entry"
    assert [r.n for r in messages.search("three regions")] == [message.n], "resource search finds a file by its tags"
    assert [r.n for r in messages.search("dashboard.png")] == [message.n], "resource search finds a file by its name"
    assert "message:1  dashboard.png — deployment graph with three regions" in search_text(record, "deployment graph", 0), \
        "journal search includes matching file tags"
    reply = dispatch("GET", "/api/t/search", record.root, {"q": "three regions"}, {})
    assert reply.body[0]["matches"] == [{"name": "dashboard.png", "tags": "deployment graph with three regions", "url": "/api/t/message/1/files/dashboard.png"}], \
        "viewer search identifies the matching attachment"
    assert refused(lambda: messages.tag(message.n, "missing.png", "nothing")) == "message 1 has no file missing.png", \
        "unknown files cannot be tagged"

    text = folder / "notes.txt"
    text.write_text("notes")
    messages.attach(message.n, str(text))
    assert len(Nudges(record, actor=SYSTEM).all()) == 1, "non-media attachments do not ask for visual tags"

    later = fresh("later")
    later_messages = Messages(later, actor=USER)
    later_message = later_messages.create("before the agent starts")
    later_messages.attach(later_message.n, str(image))
    later_row = later_messages.load(later_message.n)
    later_row.files["walkthrough.mp4"] = "video; 4 frames every 0.5 seconds"
    later_messages.save(later_row, "updated")
    later_agent = Agents(later, actor=SYSTEM).create("new session", status="working")
    Agents(later, actor=SYSTEM).update(later_agent.n, event="SessionStart")
    assert len(Nudges(later, actor=SYSTEM).all()) == 2, "a starting agent hears about media attached while none was live"

    real = folder / "shot.png"
    real.write_bytes(b"\x89PNG\r\n\x1a\n" + struct.pack(">I", 13) + b"IHDR" + struct.pack(">II", 1390, 486) + b"\x08\x06\x00\x00\x00" + b"\0" * 4)
    jpg = folder / "photo.jpg"
    jpg.write_bytes(b"\xff\xd8\xff\xe0" + struct.pack(">H", 16) + b"JFIF\0" + b"\0" * 9 + b"\xff\xc0" + struct.pack(">H", 17) + b"\x08" + struct.pack(">HH", 480, 640) + b"\x03" + b"\0" * 9 + b"\xff\xd9")
    messages.attach(message.n, str(real))
    messages.attach(message.n, str(jpg))
    assert messages.load(message.n).pictures == {"shot.png": [1390, 486], "photo.jpg": [640, 480]}, \
        "an image's width and height are read from its header on attach, so the viewer can reserve its box"
    assert ("dashboard.png" in messages.load(message.n).pictures) is False, "a file with no readable size has no entry"
    messages.detach(message.n, "shot.png")
    assert ("shot.png" in messages.load(message.n).pictures) is False, "detach drops the size with the file"
