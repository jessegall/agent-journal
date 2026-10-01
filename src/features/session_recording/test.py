import json
import subprocess
import sys
import threading
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

import features
from controllers.types import Agents, Todos
from features.session_recording.controller import Recordings
from features.session_recording.recorder import Recorder
from features.session_recording.demo import leaks
from features.session_recording.scrub import Scrubber
from resources.base import AGENT, SYSTEM, Refused
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


REPOSITORY = Path(__file__).resolve().parents[3]
WEB = REPOSITORY / "src" / "web" / "demo"
BOOT = """
import {readFileSync} from "node:fs";
globalThis.__DEMO_BUILD__ = "test";
globalThis.location = {origin: "http://demo"};
const {expand} = await import(process.argv[1] + "/moments.js");
const {StandIn} = await import(process.argv[1] + "/standIn.js");
const standIn = new StandIn(expand(JSON.parse(readFileSync(process.argv[2], "utf8"))));
const todos = async () => (await standIn.answer("GET", "/api/t/todo?completed=1").json()).rows.map((row) => row.title);
const first = await todos();
const dashboard = await standIn.answer("GET", "/api/t/dashboard?types=todo&completed=1&last=25&events=100").json();
const stepped = [standIn.step(), standIn.step(), standIn.step()];
console.log(JSON.stringify({project: standIn.moment.manifest.project, first, last: await todos(), stepped, dashboard: Object.keys(dashboard)}));
"""


def test_every_scenario_script_plays_every_branch_through_this_journal_without_a_hold(tmp_path):
    sys.path.insert(0, str(REPOSITORY))
    from scripts.demo.record import SCENARIOS, played
    for key in SCENARIOS:
        played(key, tmp_path / key, 0)


def recorded_session(tmp_path):
    features.load()
    record = fresh()
    folder = tmp_path / "recording"
    recorder = Recorder(record.root, folder)
    machine = f"{Path.home()}/projects/shop mail jesse@example.org at https://abc.tunler.example.net/x session 123e4567-e89b-12d3-a456-426614174000"
    (record.root.parent / "notes.txt").write_text(machine)
    todo = Todos(record, actor=AGENT).create("first row", brief=machine)
    recorder.poll()
    Todos(record, actor=AGENT).update(todo.n, title="renamed row")
    recorder.poll()
    Todos(record, actor=AGENT).create("third row")
    recorder.poll()
    return record, folder


def test_a_recording_that_holds_the_machine_is_refused_until_it_is_scrubbed(tmp_path):
    record, folder = recorded_session(tmp_path)
    recordings = Recordings(record, actor=SYSTEM)
    assert leaks(folder, Scrubber()), "the synthetic session holds a home path, an email, a tunnel host and a session id"
    with pytest.raises(Refused, match="journal record scrub"):
        recordings.build(str(folder), str(tmp_path / "demo.json"))
    recordings.scrub(str(folder))
    assert not leaks(folder, Scrubber())
    assert "jesse@example.org" not in (folder / "frames.jsonl").read_text() + "".join(blob.read_text() for blob in (folder / "blobs").iterdir())


def test_the_demo_is_built_from_the_real_server_and_boots_through_the_stand_in(tmp_path):
    record, folder = recorded_session(tmp_path)
    recordings = Recordings(record, actor=SYSTEM)
    recordings.scrub(str(folder))
    shipped = tmp_path / "demo.json"
    recordings.build(str(folder), str(shipped))
    demo = json.loads(shipped.read_text())
    assert len(demo["moments"]) == 3
    assert len(set(demo["answers"])) < len(demo["moments"]) * len(demo["moments"][0]["answers"]), "an answer that did not change is stored once"
    assert not Scrubber().leaks(shipped.read_text()) and "/home/demo" in shipped.read_text()
    done = subprocess.run(["node", "--input-type=module", "-e", BOOT, WEB.as_uri(), str(shipped)], capture_output=True, text=True, timeout=60)
    assert done.returncode == 0, done.stderr
    got = json.loads(done.stdout)
    assert got["first"] == ["first row"] and got["last"] == ["renamed row", "third row"], "stepping replays the recorded moments in order"
    assert got["stepped"] == [True, True, False]
    assert "rows" in got["dashboard"]


PLAY = WEB / "play.mjs"


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args) -> None:
        pass


@contextmanager
def served(folder: Path):
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(folder)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}/"
    finally:
        server.shutdown()


def test_a_visitor_plays_every_branch_of_every_shipped_scenario_to_the_end_at_a_hundred_times_speed(tmp_path):
    sys.path.insert(0, str(REPOSITORY))
    from scripts.demo.record import SCENARIOS
    site = tmp_path / "site"
    subprocess.run(["npx", "vite", "build", "--mode", "demo", "--outDir", str(site), "--emptyOutDir"], cwd=WEB.parent, check=True, capture_output=True, timeout=180)
    runs = [(key, page, branch) for key in SCENARIOS for page, branch in (("", "0"), ("", "1"))] + [("bakery", "phone.html", "1")]
    with served(site) as url:
        played = {run: subprocess.run(["node", str(PLAY), f"{url}{run[1]}?speed=100&scenario={run[0]}", run[2]], cwd=WEB.parent,
                                      capture_output=True, text=True, timeout=300) for run in runs}
    for run, done in played.items():
        assert done.returncode == 0, f"{run}: {done.stdout[-400:]} {done.stderr[-400:]}"
    got = {run: json.loads(done.stdout) for run, done in played.items()}
    for run, one in got.items():
        assert one["errors"] == [], run
        assert {"send", "answer"} <= set(one["moves"]), f"{run}: the visitor sends the messages and picks the answer"
        assert one["branch"] and all(one["todos"]), f"{run}: the chosen branch plays through to its last to-do"
        assert "sending" not in one["text"], f"{run}: a sent message lands as the recorded one"
    assert all(got[(key, "", "0")]["branch"] != got[(key, "", "1")]["branch"] for key in SCENARIOS), "each answer plays its own ending"
    assert "approve" in got[("bakery", "", "0")]["moves"], "the visitor approves the plan with its button"
    assert got[("bakery", "", "0")]["cards"] > 0, "the file feed shows the agent's recorded edits"
    assert "Agents at work" in got[("helpers", "", "0")]["panes"], "switching to Orchestrator mode moves Home to the Orchestrator layout"
