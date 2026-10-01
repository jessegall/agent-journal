import json

import features
from controllers.types import Agents, Todos
from features.session_recording.controller import Recordings
from features.session_recording.recorder import Recorder
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh


def frames(folder) -> list[dict]:
    return [json.loads(line) for line in (folder / "frames.jsonl").read_text().splitlines()]


def test_a_write_makes_a_frame_with_the_changed_row_and_file_and_a_quiet_poll_makes_none(tmp_path):
    record = fresh()
    project = record.root.parent
    recorder = Recorder(record.root, tmp_path)
    (project / "page.txt").write_text("one")
    todo = Todos(record, actor=AGENT).create("first row")
    assert recorder.poll(), "a new event makes a frame"
    assert not recorder.poll(), "nothing grew, so nothing is recorded"
    (project / "page.txt").write_text("two")
    (project / ".git").mkdir()
    (project / ".git" / "HEAD").write_text("ref")
    Todos(record, actor=AGENT).update(todo.n, title="second row")
    assert recorder.poll()
    first, second = frames(tmp_path)
    assert "files/page.txt" in first["changed"] and not any(name.startswith("files/.git") for name in first["changed"]), "project files are recorded, .git is not"
    row = next(name for name in second["changed"] if name == "record/environments/t/todo/001.md")
    assert (tmp_path / "blobs" / second["changed"][row]).read_text().count("second row"), "the changed row is stored by content"
    assert (tmp_path / "blobs" / second["changed"]["files/page.txt"]).read_text() == "two"
    assert second["events"] and not second["gone"]


def test_stop_copies_the_transcript_of_an_agent_that_ran(tmp_path, monkeypatch):
    features.load()
    record = fresh()
    transcript = tmp_path / "session.jsonl"
    transcript.write_text("{}\n")
    Agents(record, actor=SYSTEM).create("claude-1", transcript=str(transcript))
    recordings = Recordings(record, actor=SYSTEM)
    row = recordings.create("Recording into demo", folder=str(tmp_path / "demo"), pid=4242)
    monkeypatch.setattr("features.session_recording.controller.alive", lambda pid: pid == 4242)
    monkeypatch.setattr("features.session_recording.controller.os.kill", lambda pid, signal: None)
    recordings.stop()
    assert (tmp_path / "demo" / "transcripts" / "t-claude-1.jsonl").read_text() == "{}\n"
    assert recordings.load(row.n).completed, "the recording is closed"
