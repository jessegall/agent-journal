import struct
import subprocess
import sys

from pathlib import Path
from types import SimpleNamespace
from controllers.types import Messages
from features.attachment_descriptions import handlers as feature, video
from resources.base import USER
from tests.conftest import fresh
from controllers.types import Agents, Messages, Nudges
from commands.queries import search_text
from commands.http import dispatch
from resources.base import SYSTEM, USER
from tests.conftest import fresh, refused


def test_clip_length_decides_the_sampling_spacing():
    assert video.spacing(12) == 0.5, "short clips are sampled twice a second"
    assert video.spacing(90) == 2, "medium clips are sampled every two seconds"
    assert video.spacing(600) == 10, "long clips stay under sixty frames"


def test_an_attached_video_is_sampled_into_frames_the_agent_can_inspect(tmp_path):
    called = []
    run = video.subprocess.run
    which = feature.shutil.which

    def fake_run(command, **kwargs):
        called.append(command)
        if command[0] == "ffprobe":
            return SimpleNamespace(returncode=0, stdout="12.0\n", stderr="")
        pattern = Path(command[-1])
        for n in (1, 2):
            Path(str(pattern).replace("%04d", f"{n:04d}")).write_bytes(b"jpg")
        return SimpleNamespace(returncode=0, stdout="", stderr="")

    video.subprocess.run = fake_run
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
        assert called[1][called[1].index("-frames:v") + 1] == str(video.MAX_FRAMES), "ffmpeg caps the number of frames"
        messages.attach(message.n, str(source))
        assert sorted(name for name in messages.load(message.n).files if "frame" in name) == ["walkthrough-mp4-frame-0001.jpg", "walkthrough-mp4-frame-0002.jpg"], \
            "a video attached again replaces its frames instead of adding to them"
        count = 0
        for broken, failure in ((lambda command, **kwargs: SimpleNamespace(returncode=1, stdout="x", stderr="Invalid data\n"), "Invalid data"),
                                (lambda command, **kwargs: SimpleNamespace(returncode=1, stdout="", stderr=""), "ffmpeg failed"),
                                (lambda command, **kwargs: (_ for _ in ()).throw(OSError("no ffmpeg here")), "no ffmpeg here")):
            video.subprocess.run = broken
            clip = tmp_path / f"broken{count}.mp4"
            clip.write_bytes(b"video")
            messages.attach(message.n, str(clip))
            count += 1
            assert messages.load(message.n).files[clip.name].endswith(f"; no frames: {failure}"), "a clip that cannot be sampled says why"
        feature.shutil.which = lambda name: None
        messages.attach(message.n, str(tmp_path / "walkthrough.mp4"))
        assert "ffmpeg and ffprobe are required" in messages.load(message.n).files["walkthrough.mp4"], "without ffmpeg the video says what is missing"
    finally:
        video.subprocess.run = run
        feature.shutil.which = which


HERE = Path(__file__).resolve().parents[2]


def test_an_uploaded_image_is_nudged_for_tags_and_the_cli_tag_command_files_and_finds_them(tmp_path, monkeypatch):
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
    assert reply.body["hits"][0]["matches"] == [{"name": "dashboard.png", "tags": "deployment graph with three regions", "url": "/api/t/message/1/files/dashboard.png"}], \
        "viewer search identifies the matching attachment"
    from features.format import card
    messages.section(message.n, "Detail", "a long body the result card never shows")
    shown = card(messages.load(message.n), record)
    assert (shown["title"], shown["sections"], "outcome" in shown) == ("look at this", [{"title": "Detail"}], False), \
        "a result card carries its formatted title and summary and only its section titles, never text it does not show"
    from commands import http
    messages.create("three regions again")
    shown, http.SHOWN_HITS = http.SHOWN_HITS, 1
    try:
        narrowed = dispatch("GET", "/api/t/search", record.root, {"q": "three regions"}, {}).body
    finally:
        http.SHOWN_HITS = shown
    assert ([hit["title"] for hit in narrowed["hits"]], narrowed["more"]) == (["three regions again"], 1), \
        "a search shapes only the newest hits it shows and counts the rest"
    assert refused(lambda: messages.tag(message.n, "missing.png", "nothing")) == "message 1 has no file missing.png", \
        "unknown files cannot be tagged"

    messages.delete(message.n, "cleaning up")
    assert messages.search("three regions") == [], "search leaves archived rows out by default"
    assert [r.n for r in messages.search("three regions", archived=True)] == [message.n], "search finds an archived row when asked"
    assert "archived  message:1  look at this  (bring back with journal message restore 1)" in search_text(record, "three regions", 0, archived=True), \
        "journal search --archived says the hit is archived and how to bring it back"
    assert dispatch("GET", "/api/t/search", record.root, {"q": "three regions", "archived": "true"}, {}).body["hits"][0]["deleted"], \
        "viewer search marks an archived hit"
    messages.restore(message.n)

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
    Agents(later, actor=SYSTEM).saw(later_agent.n, {"hook": "SessionStart"}, event="SessionStart")
    assert len([n for n in Nudges(later, actor=SYSTEM).all() if n.data.get("feature") == "attachment_descriptions"]) == 2, "a starting agent hears about media attached while none was live"

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
    odd = folder / "odd.jpg"
    odd.write_bytes(b"\xff\xd8\x00\xff\xd0\xff\xc0" + struct.pack(">H", 17) + b"\x08" + struct.pack(">HH", 300, 400) + b"\x03" + b"\0" * 9)
    messages.attach(message.n, str(odd))
    assert messages.load(message.n).pictures["odd.jpg"] == [400, 300], "a picture's size is found past stray bytes and restart markers"
    album = folder / "album"
    album.mkdir()
    (album / "one.txt").write_text("one")
    messages.attach(message.n, str(album))
    assert (messages.folder(message.n) / "album" / "one.txt").read_text() == "one", "a folder is attached whole"
    import os
    real_replace = os.replace
    monkeypatch.setattr("controllers.files.os.replace", lambda source, target: (_ for _ in ()).throw(OSError("disk full")) if "staging" in str(source) else real_replace(source, target))
    text.write_text("newer notes")
    assert refused(lambda: messages.attach(message.n, str(text))) == "disk full", "a file that cannot be put in place is refused with the reason"
    assert (messages.folder(message.n) / "notes.txt").read_text() == "notes", "and the file that was there is put back as it was"
