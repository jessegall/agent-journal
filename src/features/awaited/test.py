import features
from controllers.types import Agents, Works
from features.helpers.controller import Helpers
from resources.base import AGENT, SYSTEM
from tests.conftest import fresh
from tests.kit import nudges, report, tick


def test_a_wait_on_a_run_and_a_helper_stands_until_both_are_back_and_then_hands_back_their_results(monkeypatch):
    features.load()
    monkeypatch.setattr("agents.terminal.detached", lambda *given: 1)
    monkeypatch.setattr("providers.codex.Codex.models", lambda self: ("gpt-5.5",))
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    run = {"id": "toolu_1", "task_id": "b2gb9ud45", "command": "pytest -q", "task": "the suite", "running": True, "ended": 0.0, "status": ""}
    report(record, "idle", "Stop", shell_rows=[run])
    Helpers(record, actor=AGENT).dispatch("Rhea", "profile the hooks", provider="codex", model="gpt-5.5")
    works = Works(record, actor=AGENT)
    work = works.create("ship the helpers")
    works.action("await")("the suite and Rhea", on="b2gb9ud45, helper:1")
    works.update(work.n, awaiting_since=works.load(work.n).awaiting_since - 900)
    tick(record)
    report(record, "working", "PostToolUse", tool="Bash", wrote=True, commands=[{"command": "ls", "tool": "Bash", "at": 9e9}])
    assert works.load(work.n).awaiting == "the suite and Rhea", "working on meanwhile leaves a named wait standing"
    assert not [n for n in nudges(record) if "check the suite" in n], "a named wait is never asked about"
    report(record, "idle", "Stop", shell_rows=[{**run, "running": False, "ended": 5.0, "status": "completed"}])
    tick(record)
    assert works.load(work.n).awaiting_on == "b2gb9ud45,helper:1", "one back is not all back"
    Helpers(record, actor=AGENT).update(1, report="hooks spend 40ms in imports")
    tick(record)
    done = works.load(work.n)
    assert (done.awaiting, done.awaiting_on) == ("", ""), "the wait ends once every one is back"
    assert "the suite completed" in done.sections[-1]["body"] and "Rhea: hooks spend 40ms in imports" in done.sections[-1]["body"], "their results go into the work's log"
    assert [n for n in nudges(record) if n.startswith("the suite and Rhea came back")], "the agent is told once to carry on"
    from features.boards.controller import Boards
    from resources.base import Refused
    Boards(record, actor=AGENT).orchestrate("on")
    try:
        works.action("await")("Rhea", on="helper:1")
    except Refused as refusal:
        assert "does not wait on a helper" in str(refusal), "an orchestrating agent is refused a wait that names a helper"
    else:
        raise AssertionError("an orchestrating agent is refused a wait that names a helper")


def test_a_wait_on_a_run_that_finished_without_an_end_time_still_ends():
    features.load()
    record = fresh()
    Agents(record, actor=SYSTEM).create("claude-1")
    report(record, "idle", "Stop", shell_rows=[{"id": "toolu_2", "task_id": "bq9", "command": "pytest -q", "task": "the suite", "running": False, "ended": 0.0, "status": ""}])
    works = Works(record, actor=AGENT)
    work = works.create("ship it")
    works.action("await")("the suite", on="bq9")
    tick(record)
    assert works.load(work.n).awaiting == "", "a run that is no longer running ends the wait, whether or not it recorded when it ended"


def test_a_state_file_changed_by_another_writer_right_after_this_one_is_read_back_from_the_file(monkeypatch, tmp_path):
    import json
    from engine import state as states
    from engine.state import State
    path = tmp_path / "gate.json"
    written = states.write_json

    def raced(where, data, indent=None):
        written(where, data)
        where.write_text(json.dumps({"released": True}))
    monkeypatch.setattr(states, "write_json", raced)
    State(path).update({"hold": {"why": "nothing is open"}})
    monkeypatch.setattr(states, "write_json", written)
    assert State(path).all() == {"released": True}, "what another writer left on the file is what the next read sees, never the copy this one made"


def test_a_session_another_process_wrote_while_this_one_wrote_is_read_at_once(monkeypatch):
    import json
    from engine import sessions as files
    from engine.sessions import Sessions
    record = fresh()
    sessions = Sessions(record.root)
    sessions.write("claude-1", environment="main")
    assert sessions.read("claude-1").environment == "main"
    written = files.write_json

    def raced(path, data, indent=None):
        written(path, data)
        other = sessions.path("claude-2")
        other.parent.mkdir(parents=True, exist_ok=True)
        other.write_text(json.dumps({"environment": "ticket-25"}))
        sessions.files.append_change("claude-2")
    monkeypatch.setattr(files, "write_json", raced)
    sessions.write("claude-3", environment="main")
    monkeypatch.setattr(files, "write_json", written)
    assert sessions.read("claude-2").environment == "ticket-25", "a session another process wrote at the same moment is read, never left out of a copy kept beside it"


def test_an_agent_has_one_command_in_flight_and_never_waits_on_another_agents():
    from commands.lanes import AgentLanes, agent_of
    lanes = AgentLanes()
    assert agent_of(["--root", "r", "--session", "claude-1", "todo", "all"]) == "claude-1" and agent_of(["todo", "all"]) == "", "a command names its agent with --session"
    first = lanes.of("claude-1")
    first.acquire()
    assert lanes.of("claude-1") is first and not first.acquire(blocking=False), "an agent's second command waits for its first"
    other = lanes.of("claude-2")
    assert other.acquire(blocking=False), "another agent's command does not wait on it"
    other.release()
    first.release()
    assert lanes.of("claude-1").acquire(blocking=False), "and the lane is free again once the command is answered"


def test_a_lock_held_longer_than_a_quarter_second_is_noted_with_the_stack_that_held_it(tmp_path, monkeypatch):
    from engine import waits
    monkeypatch.setattr(waits, "HELD_LONG", 0.0)
    with waits.holding("the record lock of main", tmp_path):
        pass
    assert not (tmp_path / waits.HELD_LOG).exists(), "the request itself writes no file for the note"
    waits.write_holds()
    note = (tmp_path / waits.HELD_LOG).read_text()
    assert "the record lock of main held" in note and "test_a_lock_held_longer" in note, "the note names the lock and the code that held it"


def test_a_request_never_walks_a_row_folder_the_background_renewal_has_not_reached_yet(tmp_path):
    from dataclasses import replace
    from controllers import stored
    from controllers.types import Todos
    from tests.kit import counted
    record = fresh()
    todos = Todos(record, actor=SYSTEM)
    todos.create("a row")
    todos.rows.numbers()
    key = str(todos.rows.folder())
    held = stored.STAMPED[key]
    stored.STAMPED[key] = replace(held, checked=held.checked - stored.STAMPS_FRESH * 2)
    with counted() as work:
        todos.rows.numbers()
    assert not work.scanned, f"stamps older than their renewal but kept are served without walking the folder; it scanned {work.scanned}"


def test_the_hash_of_a_managed_file_is_made_again_only_when_the_file_changes(tmp_path, monkeypatch):
    from features.journal_laws import managed
    made = []
    monkeypatch.setattr(managed, "managed_bytes", lambda path: made.append(path) or path.read_bytes())
    file = tmp_path / "skill.md"
    file.write_text("one")
    first = managed.managed_hash(file)
    assert (managed.managed_hash(file), len(made)) == (first, 1), "an unchanged file is not read and hashed again"
    file.write_text("two words")
    assert managed.managed_hash(file) != first and len(made) == 2, "a file whose size changed is hashed again"


def test_a_session_file_an_older_build_wrote_without_telling_anyone_is_read_within_a_few_seconds(monkeypatch):
    import json
    from engine import sessions as files
    from engine.sessions import Sessions
    record = fresh()
    sessions = Sessions(record.root)
    sessions.write("claude-1", environment="")
    assert sessions.read("claude-1").environment == "", "the session is read before the restart"
    sessions.path("claude-1").write_text(json.dumps({"environment": "main", "pid": 7, "launch": 2}))
    monkeypatch.setattr(files, "VERIFY_EVERY", 0.0)
    assert sessions.read("claude-1").environment == "main", "a file rewritten with no changes entry and no new folder is still found by the check of every known file"


def test_an_engine_supervisor_on_another_build_than_the_installed_one_does_not_supervise(tmp_path, monkeypatch):
    import threading
    from runner import engines
    root = tmp_path / ".journal"
    root.mkdir()
    (root / "journal-2.0.0-aaa.pyz").write_text("a")
    (root / "journal.pyz").symlink_to("journal-2.0.0-aaa.pyz")
    monkeypatch.setattr(engines, "ZIPPED", True)
    monkeypatch.setattr(engines, "CODE", root / "journal-1.0.0-old.pyz")
    assert (engines.current(root), engines.installed(root).name) == (False, "journal-2.0.0-aaa.pyz"), "an engine is started from the installed build, not from the build of whoever starts it"
    started = []
    monkeypatch.setattr(engines, "Children", lambda given: started.append(given))
    stopping = threading.Event()
    thread = threading.Thread(target=engines.supervise, args=(root, stopping))
    thread.start()
    stopping.wait(0.3)
    stopping.set()
    thread.join(5)
    assert not started, "a supervisor on an older build starts no engines, so none is started that would stop at once and be started again"
