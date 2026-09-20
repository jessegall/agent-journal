import struct
import subprocess
import sys
from pathlib import Path

import pytest

import features
from controllers.types import Agents, Messages, Nudges
from commands.cli import search_text
from commands.http import dispatch
from resources.base import SYSTEM, USER
from tests.conftest import fresh, refused

HERE = Path(__file__).resolve().parents[3]


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


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
