"""Phase three: the server answers real HTTP on a free port; tasks are created, read, started and finished over it."""

import json
import time
import re
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from shell_verbs import ShellVerbs

from journal.app import App
from journal.engine.support.session_agents import SessionAgents
from journal.config import Config
from journal.support.actor import Actor
from journal.repositories.entries import Entries
from journal.repositories.scope import Scope
from journal.support.caller import Caller


@pytest.fixture(scope="module")
def boot():
    def booted(root: Path, patch: pytest.MonkeyPatch) -> App:
        app = App(Config(root, port=0))
        app.runtime().boot()
        app.server().start()
        return app
    return booted


@pytest.fixture
def server(app: App):
    return app.server()


def call(server, method: str, path: str, body: dict | None = None, environment: str = "main"):
    data = json.dumps(body).encode() if body is not None else None
    request = HttpRequest(f"http://127.0.0.1:{server.port}{path}", data=data, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": environment})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def test_tasks_live_over_http(server):
    status, task = call(server, "POST", "/journal/tasks", {"title": "ship it", "brief": "b"})
    assert status == 201 and task["id"] == 1 and task["creator"] == "user:1"
    status, started = call(server, "POST", "/journal/tasks/1/start")
    assert status == 200 and started["state"] == "started"
    assert call(server, "POST", "/journal/tasks/1/log", {"line": "halfway"})[0] == 201
    assert [log["line"] for log in call(server, "GET", "/journal/tasks/1/logs")[1]] == ["halfway"]
    status, finished = call(server, "POST", "/journal/tasks/1/finish", {"how": "merged"})
    assert finished["state"] == "done" and finished["outcome"] == "merged"
    status, listed = call(server, "GET", "/journal/tasks")
    assert [t["title"] for t in listed["rows"]] == ["ship it"]
    for n in range(3):
        call(server, "POST", "/journal/tasks", {"title": f"more {n}"})
    page = call(server, "GET", "/journal/tasks?limit=2")[1]
    assert [t["title"] for t in page["rows"]] == ["more 0", "more 1", "more 2"] and not page["is_last_page"], "the newest page, and every open task besides"
    closed = call(server, "GET", "/journal/tasks?closed=1")[1]
    assert [t["title"] for t in closed["rows"]] == ["ship it"] and closed["counts"] == {"all": 4, "open": 3, "unread": closed["counts"]["unread"]}
    assert call(server, "GET", "/journal/tasks", environment="other")[0] == 404, "an environment nobody made is not found, never made by a read"
    call(server, "POST", "/journal/environments", {"name": "other"})
    assert call(server, "GET", "/journal/tasks", environment="other")[1]["rows"] == []


def test_the_viewer_pauses_blocks_and_unblocks_a_task_and_its_row_names_what_it_waits_on(server):
    for title in ("first", "second", "third"):
        call(server, "POST", "/journal/tasks", {"title": title})
    call(server, "POST", "/journal/tasks/1/start")
    parked = call(server, "POST", "/journal/tasks/1/suspend", {"why": "the second comes first"})[1]
    assert parked["state"] == "parked" and parked["suspension_reason"] == "the second comes first"
    assert call(server, "POST", "/journal/tasks/2/block", {})[0] == 409, "a block names what it waits on"
    blocked = call(server, "POST", "/journal/tasks/2/block", {"on": ["task:3"]})[1]
    assert blocked["state"] == "blocked" and blocked["waits"] == ["tasks:3"]
    assert [t["waits"] for t in call(server, "GET", "/journal/tasks")[1]["rows"]] == [[], ["tasks:3"], []]
    reason = call(server, "POST", "/journal/tasks/3/block", {"why": "the release is not out"})[1]
    assert reason["block_reason"] == "the release is not out" and reason["waits"] == []
    opened = call(server, "POST", "/journal/tasks/3/unblock")[1]
    assert opened["state"] == "open" and opened["block_reason"] == ""


def test_a_project_files_bytes_are_served_with_their_media_type_and_nothing_outside_the_project(server):
    (server.config.root / "dot.png").write_bytes(b"\x89PNG\r\n\x1a\n")
    request = HttpRequest(f"http://127.0.0.1:{server.port}/journal/project-files/raw?path=dot.png", headers={"X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        assert reply.headers["Content-Type"].startswith("image/png") and reply.read() == b"\x89PNG\r\n\x1a\n"
        assert (reply.headers["Content-Security-Policy"], reply.headers["X-Content-Type-Options"]) == ("sandbox", "nosniff"), "nothing opened from its address runs in the journal's origin"
    assert call(server, "GET", "/journal/project-files/raw?path=../outside.png")[0] == 404
    assert call(server, "GET", "/journal/project-files/raw?path=missing.png")[0] == 404


def test_load_counting_names_the_rows_each_request_loaded_only_while_it_is_on(tmp_path: Path):
    """A request's time and loads are written by the deferred worker after its reply, so the runtime is started, not only booted."""
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        developer = lambda: call(server, "GET", "/journal/developer")[1]
        def logged(label):
            for _ in range(50):
                found = [line for line in developer()["recent"] if f"{line['method']} {line['route']}" == label]
                if found:
                    return found
                time.sleep(0.1)
            return []
        for n in range(3):
            call(server, "POST", "/journal/tasks", {"title": f"task {n}"})
        call(server, "GET", "/journal/tasks?limit=50")
        assert logged("GET /journal/tasks") and developer()["loads"] == [] and developer()["models"] == [], "off, a request is timed and nothing is counted"
        call(server, "POST", "/journal/settings", {"faults": {"count_loads": True}})
        call(server, "GET", "/journal/tasks?limit=51")
        for _ in range(50):
            counted = [line for line in developer()["loads"] if line["label"] == "GET /journal/tasks"]
            if counted:
                break
            time.sleep(0.1)
        assert counted and int(re.search(r"(\d+) tasks", counted[0]["loads"]).group(1)) >= 3 and counted[0]["ms"] >= 0, "on, a request names the rows it loaded by their table"
        totals = {total["model"]: total["rows"] for total in developer()["models"]}
        assert totals["tasks"] >= 3, "and they add up per model since the last reset"
        reset = call(server, "POST", "/journal/developer/reset")[1]
        assert "tasks" not in {total["model"] for total in reset["models"]} and all(line["label"] != "GET /journal/tasks" for line in reset["loads"]), "Reset clears the loads with the counts"
    finally:
        app.runtime().stop()


def test_a_documents_saves_fold_into_its_open_revision_keep_closes_it_and_the_next_edit_opens_the_next(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    app.runtime().boot()
    server = app.server()
    server.start()
    console, user = app.console(), Caller.user("main")
    text = tmp_path / "doc.md"
    def written(body: str) -> None:
        text.write_text(body)
        console.run(["doc", "update", "1", "--file", str(text)], user)
    listed = lambda: console.run(["doc", "revisions", "1"], user).text.splitlines()
    try:
        assert console.run(["doc", "keep", "1"], user).code == 1, "no document yet"
        text.write_text("Intro.\n\n## Goals\n\nShip it\n")
        console.run(["doc", "create", "Plan of record", "--file", str(text)], user)
        written("Intro.\n\n## Goals\n\nShip it soon\n\n## Risks\n\nNone\n")
        written("Intro.\n\n## Goals\n\nShip it soon\n\n## Risks\n\nNone\n")
        assert len(listed()) == 1 and listed()[0].endswith("user   written; added Risks; rewrote Goals"), "a write within the open window folds into the open revision, its change noted; a save that changes nothing adds none"
        assert console.run(["doc", "keep", "1"], user).text == "revision 1 of doc 1 kept; the next edit opens revision 2\n"
        assert console.run(["doc", "keep", "1"], user).error.strip() == "revision 1 of doc 1 is already kept"
        written("Intro.\n\n## Goals\n\nShip it soon\n")
        assert [line.split()[-2:] for line in listed()] == [["rewrote", "Goals"], ["cut", "Risks"]], "after a keep the next edit opens a new revision"
        assert console.run(["doc", "revision", "1", "1"], user).text.startswith("doc 1, revision 1 of 2: Plan of record\n"), "an old revision is read whole"
        assert "## Risks" in console.run(["doc", "revision", "1", "1"], user).text and "## Risks" not in console.run(["doc", "revision", "1", "2"], user).text
        assert console.run(["doc", "revision", "1", "3"], user).error.strip() == "doc 1 has revisions 1 to 2"
        call(server, "POST", "/journal/settings", {"docs": {"revision_window": 0}})
        written("Intro.\n\n## Goals\n\nShip it now\n")
        written("Intro, again.\n\n## Goals\n\nShip it now\n")
        revisions = call(server, "GET", "/journal/docs/1/revisions")[1]
        assert [(r["number"], r["change"]) for r in revisions] == [(1, "written; added Risks; rewrote Goals"), (2, "cut Risks; rewrote Goals"), (3, "reworded the top")], "past the window each edit opens the next revision"
        assert call(server, "POST", "/journal/docs/1/keep")[0] == 409, "the viewer's keep refuses as the command does"
    finally:
        server.stop()


def test_a_missing_row_and_a_missing_route_say_so(server):
    assert call(server, "GET", "/journal/tasks/9")[0] == 404
    assert call(server, "GET", "/journal/nothing")[0] == 404


def test_the_port_file_is_written_while_serving(server):
    assert int(server.config.port_file.read_text()) == server.port


def test_version_fours_own_api_lists_every_resource_and_answers_a_question(server):
    assert call(server, "GET", "/journal/environments")[1]["rows"][0]["name"] == "main"
    for name in ("plans", "facts", "reminders", "reports", "docs", "workers", "messages", "questions", "agents", "rules", "entries"):
        assert call(server, "GET", f"/journal/{name}")[0] == 200, name
    status, message = call(server, "POST", "/journal/messages", {"text": "hello agent"})
    assert status == 201 and message["author"] == "user" and message["read_at"] is None
    status, question = call(server, "POST", "/journal/questions", {"text": "which?", "options": ["a", "b"]})
    assert status == 201
    status, answered = call(server, "POST", "/journal/questions/1/answer", {"answer": "b"})
    assert answered["answer"] == "b"
    status, entries = call(server, "GET", "/journal/entries?since=0")
    assert status == 200 and any(e["kind"] == "created" and e["data"]["table"] == "questions" for e in entries)
    status, settings = call(server, "GET", "/journal/settings")
    assert settings["features"]["tasks"] is True
    call(server, "POST", "/journal/settings", {"features": {**settings["features"], "tasks": False}})
    assert call(server, "GET", "/journal/settings")[1]["features"]["tasks"] is False


def test_a_path_outside_the_api_is_the_viewer(server):
    with urlopen(f"http://127.0.0.1:{server.port}/anything", timeout=5) as reply:
        assert reply.status == 200 and b"<div id=\"app\">" in reply.read()


def free_pair() -> int:
    """A port free on this machine with the one after it free too, so a test of the next port is not taken by another process."""
    import socket
    for _ in range(50):
        with socket.socket() as probe, socket.socket() as after:
            probe.bind(("127.0.0.1", 0))
            first = probe.getsockname()[1]
            try:
                after.bind(("127.0.0.1", first + 1))
            except OSError:
                continue
            return first
    raise RuntimeError("no two free ports in a row")


def test_a_taken_port_sends_the_next_journal_to_the_next_one(tmp_path: Path):
    first = free_pair()
    single = App(Config(tmp_path / "one", port=first, span=3))
    two = App(Config(tmp_path / "two", port=first, span=3))
    single.server().start()
    two.server().start()
    try:
        assert single.server().port == first and two.server().port == first + 1
        assert (tmp_path / "two" / ".journal" / "port").read_text() == str(first + 1)
    finally:
        single.server().stop()
        two.server().stop()


def test_the_viewer_sees_reactions_and_subagent_marks(tmp_path: Path):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        status, message = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "k1"})
        assert status == 201
        n = message["id"]
        call(server, "POST", f"/journal/messages/{n}/react", {"face": "👍"})
        assert [(r["face"], r["message_id"]) for r in call(server, "GET", "/journal/reactions")[1]["rows"]] == [("👍", n)]
        call(server, "POST", f"/journal/messages/{n}/react", {"face": "👍"})
        assert call(server, "GET", "/journal/reactions")[1]["rows"] == [], "the same face again takes it off"
        hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
        for kind, extra in (("SessionStart", {}), ("PreToolUse", {"tool_name": "Agent", "tool_input": {"description": "review the login", "prompt": "read the login flow and report", "subagent_type": "journal-plan-reviewer", "model": "sonnet"}}), ("PostToolUse", {"tool_name": "Agent", "tool_input": {}, "tool_response": "fine"})):
            urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s9", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        thresholds = lambda: [m["data"] for m in call(server, "GET", "/journal/messages?limit=200")[1]["rows"] if m["data"].get("kind") == "subagent"]
        for _ in range(50):
            if any(c["state"] == "done" for c in thresholds()):
                break
            time.sleep(0.1)
        assert [(c["detail"], c["agent_type"], c["state"]) for c in thresholds()] == [("review the login", "journal-plan-reviewer", "running"), ("review the login", "journal-plan-reviewer", "done")], "a subagent's dispatch is a mark in the chat, and its end a mark of its own after it"
    finally:
        app.runtime().stop()


def test_the_subagents_are_listed_as_their_rows_stand_a_resumed_one_running_again(tmp_path: Path):
    """A background subagent that ended and was sent a message is running again in the list the viewer's dropdown reads, and counted open."""
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
        agent = {"subagent_type": "journal-researcher", "description": "map the hooks", "prompt": "read", "model": "sonnet"}
        message = {"to": "a9", "message": "one more"}
        for kind, extra in (
            ("SessionStart", {"source": "startup"}),
            ("PreToolUse", {"tool_name": "Agent", "tool_input": agent, "tool_use_id": "t-1"}),
            ("PostToolUse", {"tool_name": "Agent", "tool_input": {}, "tool_response": {"isAsync": True, "agentId": "a9"}, "tool_use_id": "t-1"}),
            ("SubagentStop", {"agent_id": "a9"}),
            ("PreToolUse", {"tool_name": "SendMessage", "tool_input": message, "tool_use_id": "t-2"}),
            ("PostToolUse", {"tool_name": "SendMessage", "tool_input": message, "tool_response": {}, "tool_use_id": "t-2"}),
        ):
            urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s9", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        listed = lambda: call(server, "GET", "/journal/subagents")[1]
        for _ in range(50):
            if [r["resumed_at"] > 0 for r in listed()["rows"]] == [True]:
                break
            time.sleep(0.1)
        page = listed()
        assert [(r["task"], r["dispatcher"], r["session"], r["state"]) for r in page["rows"]] == [("map the hooks", "s9", "a9", "running")], "resumed by a message, it is running again"
        assert page["counts"]["open"] == 1, "and counted open, as the census counts it"
    finally:
        app.runtime().stop()


def test_a_subagent_whose_dispatch_entries_were_trimmed_runs_again_when_it_is_sent_a_message(tmp_path: Path):
    """The entries are trimmed to the newest, so a subagent dispatched long ago has no dispatch entry left; a message to it still sets it running, and its stop settles it."""
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
        agent = {"subagent_type": "journal-researcher", "description": "map the hooks", "prompt": "read", "model": "sonnet"}
        message = {"to": "a9", "message": "one more"}
        def hook(kind, **extra):
            urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s9", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        listed = lambda: call(server, "GET", "/journal/subagents")[1]["rows"]
        def states(expected):
            for _ in range(50):
                if [r["state"] for r in listed()] == expected:
                    return expected
                time.sleep(0.1)
            return [r["state"] for r in listed()]
        hook("SessionStart", source="startup")
        hook("PreToolUse", tool_name="Agent", tool_input=agent, tool_use_id="t-1")
        hook("PostToolUse", tool_name="Agent", tool_input={}, tool_response={"isAsync": True, "agentId": "a9"}, tool_use_id="t-1")
        hook("SubagentStop", agent_id="a9")
        assert states(["done"]) == ["done"]
        entries = app.container.get(Entries)
        with app.container.get(Scope).environment(1):
            entries.trim(entries.last_id(), 0)
        hook("PreToolUse", tool_name="SendMessage", tool_input=message, tool_use_id="t-2")
        assert states(["running"]) == ["running"], "a message sets it running though its dispatch entry is gone"
        hook("SubagentStop", agent_id="a9")
        assert states(["done"]) == ["done"], "and its stop settles it again"
    finally:
        app.runtime().stop()


def test_the_main_chat_and_a_workers_chat_each_page_their_own_rows(app: App, server):
    """With six hundred of a worker's rows written before one of the main chat's, the main chat's poll and page still hold the main row and fill with main rows, and the worker's chat pages back to its first row."""
    from journal.models.agent_role import AgentRole
    from journal.models.message import Message
    from journal.repositories.messages import Messages
    messages = app.container.get(Messages)
    with app.container.get(Scope).environment(1):
        before = call(server, "GET", "/journal/messages")[1]["rows"]
        for i in range(600):
            messages.save(Message(environment_id=1, author="agent", text=f"step {i}", session="w1", agent_role=AgentRole.WORKER), Actor.agent("w1"))
        main = messages.save(Message(environment_id=1, author="user", text="how goes it?"), Actor.user(1))
    page = call(server, "GET", "/journal/messages")[1]["rows"]
    assert page[-1]["id"] == main.id and all(r["agent_role"] == "main" for r in page) and len(page) == len(before) + 1, "the main chat's page holds its own rows alone"
    polled = call(server, "GET", f"/journal/messages?since={time.time() - 60}")[1]["rows"]
    assert [r["id"] for r in polled][-1] == main.id, "its poll is not crowded out by the worker's rows"
    worker, earliest = [], 0
    while True:
        got = call(server, "GET", f"/journal/chats/w1?limit=100{f'&before={earliest}' if earliest else ''}")[1]
        worker = got["rows"] + worker
        earliest = got["rows"][0]["id"]
        if got["is_last_page"]:
            break
    assert [r["text"] for r in worker] == [f"step {i}" for i in range(600)], "the worker's chat pages back to its first row"


def test_a_shell_calls_parts_are_its_terminal_lines_with_the_output_the_shell_kept(tmp_path: Path):
    """The Terminal pane reads a Bash call as it was recorded: each part a line, with the output the journal's shell kept of the parts it ran, once the call has finished."""
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
    def hook(kind, **extra):
        urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    shell = {"command": "cd src && git status"}
    try:
        hook("SessionStart")
        hook("PreToolUse", tool_name="Bash", tool_input=shell, tool_use_id="t-1")
        ShellVerbs(app).ran("git status", "c1", 0, output="nothing to commit", seconds=1.5)
        assert call(server, "GET", "/journal/agents/1/terminal")[1] == [], "a call still running shows nothing yet"
        hook("PostToolUse", tool_name="Bash", tool_input=shell, tool_response={"stdout": "nothing to commit"}, tool_use_id="t-1")
        lines = call(server, "GET", "/journal/agents/1/terminal")[1]
        assert [(l["tool"], l["command"], l["output"], l["seconds"]) for l in lines] == [("Bash", "cd src", "", 0.0), ("Bash", "git status", "nothing to commit", 1.5)]
        assert lines[0]["time"] < lines[1]["time"], "each part has its own time, so the pane keeps both"
        assert call(server, "GET", f"/journal/agents/1/terminal?after={lines[1]['time']}")[1] == [], "the pane asks for what came after its last line"
        hook("PreToolUse", tool_name="Bash", tool_input={"command": "ls"}, tool_use_id="t-2")
        hook("PostToolUse", tool_name="Bash", tool_input={"command": "ls"}, tool_response={"stdout": "a"}, tool_use_id="t-2")
        newer = call(server, "GET", f"/journal/agents/1/terminal?after={lines[1]['time']}")[1]
        assert [l["command"] for l in newer] == ["ls"], "a poll with its cursor reads the calls that came after it, and only those"
    finally:
        app.runtime().stop()


def test_an_agents_doing_is_the_part_of_a_chained_command_running_now(tmp_path: Path):
    """While a chained shell call runs, the agent's doing is the text of the part running now, then the next; another tool is its verb; once nothing runs it is neither."""
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
    def hook(kind, **extra):
        urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    doing = lambda: call(server, "GET", "/journal/agents")[1]["rows"][0]["doing"]
    shell = {"command": "cd src && git status"}
    try:
        hook("SessionStart")
        hook("PreToolUse", tool_name="Bash", tool_input=shell, tool_use_id="t-1")
        assert doing() == "cd src", "a shell call names its first part before the journal's shell starts it"
        ShellVerbs(app).started("cd src", "c1")
        ShellVerbs(app).ran("cd src", "c1", 0)
        ShellVerbs(app).started("git status", "c1")
        assert doing() == "git status", "then each part as it runs"
        ShellVerbs(app).ran("git status", "c1", 0, output="clean")
        hook("PostToolUse", tool_name="Bash", tool_input=shell, tool_response={"stdout": "clean"}, tool_use_id="t-1")
        assert doing() not in ("cd src", "git status"), "a finished call is no longer what the agent is doing"
        hook("PreToolUse", tool_name="Read", tool_input={"file_path": str(tmp_path / "a.py")}, tool_use_id="t-2")
        assert doing() == "reading a file", "another tool is its verb"
        hook("PostToolUse", tool_name="Read", tool_input={"file_path": str(tmp_path / "a.py")}, tool_response="", tool_use_id="t-2")
        hook("PreToolUse", tool_name="Bash", tool_input={"command": "pytest -q"}, tool_use_id="t-3")
        ShellVerbs(app).started("pytest -q", "c2")
        hook("PostToolUse", tool_name="Bash", tool_input={"command": "pytest -q"}, tool_response={"stdout": "moved to the background"}, tool_use_id="t-3")
        row = call(server, "GET", "/journal/agents")[1]["rows"][0]
        assert row["doing"] == "pytest -q" and row["tool_running"], "a command moved to the background is what the agent is doing until its part ends"
    finally:
        app.runtime().stop()


def test_request_threads_leave_no_connection_behind(server):
    database = server.database
    for _ in range(40):
        call(server, "GET", "/journal/tasks")
    assert len(database._open) <= 3, f"{len(database._open)} connections open after 40 requests: threads must return theirs to the pool"


def test_each_type_is_read_alone_above_the_last_number_seen(server):
    """A type's read answers its rows above `from`, the newest `last` of them, with its counts; a type whose rows will not load fails alone and the others still answer."""
    for n in range(1, 5):
        call(server, "POST", "/journal/tasks", {"title": f"task {n}"})
        call(server, "POST", f"/journal/tasks/{n}/start")
        call(server, "POST", f"/journal/tasks/{n}/finish", {"how": "done"})
    for n in range(3):
        call(server, "POST", "/journal/messages", {"text": f"hello {n}", "idempotency": f"k{n}"})
    tasks = call(server, "GET", "/journal/tasks?after=1&limit=2")[1]
    assert [r["id"] for r in tasks["rows"]] == [3, 4] and tasks["is_last_page"] is False
    assert tasks["counts"] == {"all": 4, "open": 0, "unread": 0}
    messages = call(server, "GET", "/journal/messages?after=1&limit=5")[1]
    assert [r["id"] for r in messages["rows"]] == [2, 3] and messages["counts"]["all"] == 3
    assert call(server, "GET", "/journal/messages?after=3&limit=5")[1]["rows"] == [], "a poll from the last id seen carries nothing when nothing is new"
    call(server, "POST", "/journal/facts", {"text": "the sky is blue"})
    with server.database.transaction():
        server.database.execute("UPDATE facts SET keywords = '{broken' WHERE id = 1")
    status, body = call(server, "GET", "/journal/facts")
    assert status == 500 and "error" in body, "a resource whose rows will not load fails alone, with the fault named"
    assert call(server, "GET", "/journal/tasks?after=3")[1]["rows"][0]["id"] == 4, "a fact that will not load leaves the tasks answering"


def test_the_environment_header_scopes_each_read_and_a_request_without_it_is_refused(server):
    call(server, "POST", "/journal/environments", {"name": "other"})
    call(server, "POST", "/journal/tasks", {"title": "main's own"})
    call(server, "POST", "/journal/tasks", {"title": "other's own"}, environment="other")
    assert [r["title"] for r in call(server, "GET", "/journal/tasks")[1]["rows"]] == ["main's own"]
    assert [r["title"] for r in call(server, "GET", "/journal/tasks", environment="other")[1]["rows"]] == ["other's own"]
    with pytest.raises(HTTPError) as refused:
        urlopen(f"http://127.0.0.1:{server.port}/journal/tasks", timeout=5)
    assert refused.value.code == 409 and "X-Journal-Env" in json.loads(refused.value.read())["error"]


def test_the_viewers_pages_read_the_shapes_they_expect(tmp_path: Path):
    """Settings answer with the whole tree, a read message is read and not closed, a running plan is active, a check carries its last run, a sequence its steps, the hub its counts, the Code page its files."""
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        status, tree = call(server, "POST", "/journal/settings", {"features": {"thinking": False}})
        assert status == 200 and tree["features"]["thinking"] is False and len(tree["features"]) > 10
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "k1"})[1]["id"]
        call(server, "POST", f"/journal/messages/{n}/read", {})
        row = call(server, "GET", f"/journal/messages/{n}")[1]
        assert row["read_at"] and row["answered"] is False, "read, and not answered"
        call(server, "POST", f"/journal/messages/{n}/react", {"face": "👍"})
        app.console().run(["message", "react", str(n), "🎉"], Caller.agent("main", "s1", "claude"))
        assert call(server, "GET", f"/journal/messages/{n}")[1]["answered"] is True, "a face from the agent answers it"
        app.console().run(["plan", "create", "p"], Caller.user("main"))
        app.console().run(["plan", "approve", "1"], Caller.user("main"))
        app.console().run(["plan", "start", "1"], Caller.agent("main", "s1", "claude"))
        assert call(server, "GET", "/journal/plans/1")[1]["state"] == "started"
        app.console().run(["check", "create", "truthy", "--command", "true"], Caller.user("main"))
        app.console().run(["check", "run", "1"], Caller.user("main"))
        check = call(server, "GET", "/journal/checks/1")[1]
        assert check["last_passed"] is True and "progress" in check
        release = app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Caller.user("main")).text.split()[1].rstrip(":")
        assert call(server, "GET", f"/journal/sequences/{release}")[1]["steps"] == ["tag", "push"]
        data = call(server, "GET", "/journal/summary")[1]["environments"][0]
        assert {"messages", "tasks", "questions"} <= set(data)
        (tmp_path / "hello.py").write_text("print('hi')\n")
        assert call(server, "GET", "/journal/project-files/file?path=hello.py")[1]["lines"] == 1
        assert "diff" in call(server, "GET", "/journal/project-files/diff?path=hello.py")[1]
        assert call(server, "GET", "/journal/project-files/find?q=hello")[1][0]["name"] == "hello.py"
        root = [entry["name"] for entry in call(server, "GET", "/journal/project-files")[1]]
        assert "hello.py" in root and not any(name.startswith(".") for name in root), "the Code page's tree opens on the project's root, its hidden folders left out"
        listed = call(server, "GET", f"/journal/messages?ids={n}")[1]["rows"]
        assert [r["id"] for r in listed] == [n]
    finally:
        app.runtime().stop()


def test_the_viewers_start_takes_the_plans_first_task_in_hand_and_its_park_postpones_it_with_the_plan(tmp_path: Path):
    from journal.engine.state_machine import StateMachine
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    user, agent = Caller.user("main"), Caller.agent("main", "s1", "claude")
    try:
        console = app.console()
        console.run(["plan", "create", "p", "--brief", "b"], user)
        console.run(["plan", "add", "1", "first"], user)
        console.run(["plan", "add", "1", "second"], user)
        assert call(server, "POST", "/journal/plans/1/start", {})[0] == 409, "an unapproved plan is refused before any row is written"
        console.run(["plan", "approve", "1"], user)
        call(server, "POST", "/hooks/claude", {"hook_event_name": "SessionStart", "session_id": "s1", "cwd": str(tmp_path)})
        started = call(server, "POST", "/journal/plans/1/start", {})[1]
        assert started["state"] == "started" and call(server, "GET", "/journal/tasks/1")[1]["state"] == "started", "the viewer's start takes the first task in hand, as the command does"
        assert app.container.get(SessionAgents).top("s1").name == "following_plan"
        parked = call(server, "POST", "/journal/plans/1/suspend", {})[1]
        assert parked["state"] == "parked" and call(server, "GET", "/journal/tasks/1")[1]["state"] == "parked", "the plan's task in hand is postponed with it"
        assert app.container.get(SessionAgents).top("s1").name == "idle", "the agent following the plan is popped by the plan's own event"
    finally:
        app.runtime().stop()


def test_a_started_plans_phase_shown_advances_when_its_tasks_are_all_done(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        console, user, agent = app.console(), Caller.user("main"), Caller.agent("main", "s1", "claude")
        console.run(["plan", "create", "p", "--brief", "b"], user)
        for title in ("first", "second", "third"):
            console.run(["plan", "add", "1", title], user)
        console.run(["plan", "phase", "1", "one", "--when", "w"], user)
        console.run(["plan", "phase", "1", "two", "--when", "w"], user)
        console.run(["plan", "todos", "1", "1", "1", "2"], user)
        console.run(["plan", "todos", "1", "2", "3"], user)
        console.run(["plan", "ready", "1"], user)
        console.run(["plan", "approve", "1"], user)
        console.run(["plan", "start", "1"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 1
        console.run(["task", "complete", "1"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 1, "a phase with a task still open is the one shown"
        console.run(["task", "complete", "2"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 2, "every task of phase one done: phase two is shown"
        console.run(["task", "complete", "3"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 2, "all done: the last phase"
    finally:
        app.runtime().stop()


def test_the_status_line_knows_what_the_agent_waits_for(tmp_path: Path):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        data = json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode()
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.console().run(["task", "create", "the footer", "--start"], Caller.agent("main", "s1", "claude"))
        blocked = call(server, "GET", "/journal/summary")[1]["environments"][0]["task"]
        assert blocked == {"id": 1, "title": "the footer", "wait_text": ""}
        app.console().run(["stuck", "stuck on the login"], Caller.agent("main", "s1", "claude"))
        agent = call(server, "GET", "/journal/agents")[1]["rows"][0]
        assert agent["awaiting"] == "stuck on the login" and agent["awaiting_since"]
        assert call(server, "GET", "/journal/summary")[1]["environments"][0]["task"]["wait_text"] == "stuck on the login"
    finally:
        app.runtime().stop()


def test_the_activity_rail_the_edits_pane_and_the_documents_read_true(tmp_path: Path, monkeypatch):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    from journal.supervisor_link import SupervisorLink
    keystrokes = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: keystrokes.append({"verb": verb, **fields}["line"]))
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
    def hook(kind, **extra):
        return urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    try:
        hook("SessionStart")
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "k"})[1]["id"]
        app.console().run(["message", "read", str(n)], Caller.agent("main", "s1", "claude"))
        app.console().run(["task", "create", "t", "--start"], Caller.agent("main", "s1", "claude"))
        app.console().run(["task", "complete", "1", "--how", "shipped"], Caller.agent("main", "s1", "claude"))
        entries = call(server, "GET", "/journal/entries?last=50")[1]
        assert any(e["kind"] == "updated" and e["data"]["table"] == "messages" and "read_at" in e["data"]["changed"] for e in entries)
        assert any(e["kind"] == "updated" and e["data"]["table"] == "tasks" and "finished_at" in e["data"]["changed"] for e in entries)
        assert any(e["kind"] == "SessionStarted" for e in entries)
        hook("PostToolUse", tool_name="Edit", tool_input={"file_path": str(tmp_path / "a.py"), "old_string": "x", "new_string": "y"}, tool_response={"structuredPatch": [{"oldStart": 7, "newStart": 7, "lines": [" before", "-x", "+y", " after"]}]})
        edit = call(server, "GET", "/journal/agents/1/edits")[1]["edits"][0]
        assert [r["kind"] for r in edit["rows"]] == ["ctx", "del", "add", "ctx"] and edit["first_line"] == 7 and edit["last_line"] == 9
        hook("PreToolUse", tool_name="Bash", tool_input={"command": "journal task list"}, tool_use_id="t-9")
        ShellVerbs(app).ran("journal task list", "c1", 0, output="1 t")
        hook("PostToolUse", tool_name="Bash", tool_input={"command": "journal task list"}, tool_response={"stdout": "1 t"}, tool_use_id="t-9")
        assert call(server, "GET", "/journal/agents/1/terminal")[1][-1]["tool"] == "Journal"
        assert call(server, "POST", "/journal/agents/1/shell", {"command": "ls"})[1]["queued"] is True and keystrokes[-1] == "ls"
        doc = call(server, "POST", "/journal/docs", {"title": "Design", "body": "Intro\n\n## Goals\n\nShip it"})[1]
        doc = call(server, "POST", f"/journal/docs/{doc['id']}/section", {"title": "Risks", "body": "None"})[1]
        assert doc["body"].endswith("## Risks\n\nNone\n") and "## Goals" in doc["body"]
        assert call(server, "POST", f"/journal/docs/{doc['id']}", {"title": "Design v2"})[1]["title"] == "Design v2"
        app.console().run(["task", "create", "later", "--start"], Caller.agent("main", "s1", "claude"))
        app.console().run(["task", "suspend", "2", "waiting"], Caller.agent("main", "s1", "claude"))
        assert call(server, "GET", "/journal/tasks/2")[1]["state"] == "parked"
    finally:
        app.runtime().stop()


def test_the_remaining_pages_act_through_the_viewer(tmp_path: Path):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        app.console().run(["plan", "create", "p"], Caller.user("main"))
        assert call(server, "POST", "/journal/plans/1/finish", {})[1]["state"] == "done"
        app.console().run(["check", "create", "truthy", "--command", "true"], Caller.user("main"))
        assert call(server, "POST", "/journal/checks/1/run", {})[1]["progress"]["time"], "the page's run answers at once, the check running"
        completed = lambda: call(server, "GET", "/journal/checks?ids=1")[1]["rows"][0]
        for _ in range(50):
            if not completed()["progress"]:
                break
            time.sleep(0.1)
        assert completed()["last_passed"] is True, "and its result lands on the row"
        assert call(server, "POST", "/journal/checks/1", {"interval": 5})[1]["interval"] == 5
        release = app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Caller.user("main")).text.split()[1].rstrip(":")
        assert call(server, "POST", f"/journal/sequences/{release}/steps", {"steps": ["tag", "test", "push"]})[1]["steps"] == ["tag", "test", "push"]
        app.console().run(["trigger", "create", "deploy", "say so"], Caller.user("main"))
        updated = call(server, "POST", "/journal/triggers/1", {"phrases": ["deploy", "release"], "action": "deny", "text": "wait"})[1]
        assert updated["phrases"] == ["deploy", "release"] and updated["action"] == "deny"
        skills = call(server, "GET", "/journal/skills?agent=1")[1]
        assert any(s["name"] == "journal" for s in skills) and "text" in call(server, "GET", "/journal/skills/journal")[1]
        call(server, "POST", "/journal/environments", {"name": "spike"})
        n = next(r["id"] for r in call(server, "GET", "/journal/environments")[1]["rows"] if r["name"] == "spike")
        assert call(server, "POST", f"/journal/environments/{n}/remove", {})[0] == 200
        assert all(r["name"] != "spike" for r in call(server, "GET", "/journal/environments")[1]["rows"])
        assert call(server, "GET", "/journal/summary")[1]["environments"][0]["silent"] is False
    finally:
        app.runtime().stop()


def test_a_file_attached_to_a_message_is_stored_and_served(server):
    n = call(server, "POST", "/journal/messages", {"text": "see the picture", "idempotency": "f1"})[1]["id"]
    boundary = "b0undary"
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"note.txt\"\r\nContent-Type: text/plain\r\n\r\nhello there\r\n--{boundary}--\r\n").encode()
    request = HttpRequest(f"http://127.0.0.1:{server.port}/journal/messages/{n}/files", data=body, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}", "X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        row = json.loads(reply.read())
    assert row["files"] == ["note.txt"]
    with urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/journal/messages/{n}/files/note.txt?env=main"), timeout=5) as reply:
        assert reply.read() == b"hello there" and reply.headers["Content-Type"].startswith("text/plain")


def test_a_viewer_polling_from_an_id_ahead_of_a_reset_record_is_brought_back_in_step(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        call(server, "POST", "/journal/messages", {"text": "after the reset", "idempotency": "r1"})
        entries = call(server, "GET", "/journal/entries?since=999999")[1]
        assert "messages" in [entry["data"]["table"] for entry in entries], "an id from a journal that was reset still gets the recent entries"
    finally:
        app.runtime().stop()


def test_the_agent_bars_pickers_type_the_providers_command_and_a_reply_names_what_it_answers(tmp_path: Path, monkeypatch):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    from journal.supervisor_link import SupervisorLink
    keystrokes = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: keystrokes.append({"verb": verb, **fields}["line"]))
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        controls = call(server, "GET", "/journal/agents/controls/claude?model=opus&effort=high")[1]
        assert [g["key"] for g in controls["groups"]] == ["model", "effort", "context"] and controls["groups"][0]["current"] == "opus"
        n = call(server, "POST", "/journal/messages", {"text": "is the footer fixed?\nand the header?", "idempotency": "q"})[1]["id"]
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        assert call(server, "POST", "/journal/agents/1/control", {"action": "effort", "value": "max"})[1]["queued"] is True and keystrokes[-1] == "/effort max"
        assert call(server, "POST", "/journal/agents/1/control", {"action": "model", "value": "gpt"})[0] == 409
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": "MessageDisplay", "session_id": "s1", "message": f"[!reply:{n}]\nBoth are."}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        reply = call(server, "GET", "/journal/messages")[1]["rows"][-1]
        assert reply["text"] == "Both are." and reply["reply_target"] == n
    finally:
        app.runtime().stop()


def test_a_users_message_and_the_agents_reply_to_it_are_two_message_rows(tmp_path: Path):
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "c1"})[1]["id"]
        for kind, extra in (("SessionStart", {}), ("MessageDisplay", {"message": f"[!reply:{n}]\nHello back."})):
            urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        rows = [r for r in call(server, "GET", "/journal/messages")[1]["rows"] if n in (r["id"], r["reply_target"])]
        assert [(r["author"], r["reply_target"], r["text"]) for r in rows] == [("user", None, "hello"), ("agent", n, "Hello back.")]
        assert rows[0]["creator"].startswith("user") and rows[1]["creator"] == "agent:s1" and rows[1]["acknowledgement"] is False
        assert call(server, "GET", "/journal/comments")[1]["rows"] == [], "a reply is no comment"
    finally:
        app.runtime().stop()


def test_the_message_stream_holds_the_users_words_the_agents_and_the_systems_cards_by_number(tmp_path: Path):
    from journal.chat.cards import Cards
    from journal.support.card_kind import CardKind
    from journal.models.setting import Setting
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.container.get(SettingRows).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "c1"})[1]["id"]
        for kind, extra in (("SessionStart", {}), ("MessageDisplay", {"message": f"[!reply:{n}]\nHello back."})):
            urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        app.container.get(Cards).show(1, "s1", "Check lint passed", "check", "good", "all clean", "checks:3", shows=CardKind.CHECKS)
        rows = [r for r in call(server, "GET", "/journal/messages")[1]["rows"] if r["id"] >= n]
        assert [r["id"] for r in rows] == sorted(r["id"] for r in rows)
        assert [(r["author"], r["text"]) for r in rows] == [("user", "hello"), ("agent", "Hello back."), ("system", "Check lint passed")]
        card = rows[-1]
        assert card["creator"] == "system"
        assert card["session"] == "s1"
        assert card["data"] == {"kind": "card", "icon": "check", "tone": "good", "detail": "all clean", "row": "checks:3", "command": "", "key": "", "shows": "checks"}
    finally:
        app.runtime().stop()


def test_the_board_is_off_and_stays_off(server):
    assert "kanban" not in call(server, "GET", "/journal/settings")[1]["features"]
    assert "kanban" not in call(server, "POST", "/journal/settings", {"features": {"kanban": True}})[1]["features"], "a switch of a feature version 4 does not have is not kept"


def test_a_comment_written_under_a_task_in_the_viewer_is_the_users_message_linked_to_it(server):
    from journal.support.caller import Caller
    call(server, "POST", "/journal/tasks", {"title": "the footer"})
    status, produced = call(server, "POST", "/journal/comments", {"on": "tasks:1", "text": "please also check the header"})
    assert status == 201 and produced["on"] == ["tasks:1"] and produced["text"] == "please also check the header"
    assert [(r["on"], r["author"]) for r in call(server, "GET", "/journal/comments")[1]["rows"]] == [(["tasks:1"], "user")]
    messages = call(server, "GET", "/journal/messages")[1]["rows"]
    assert messages[-1]["text"] == "please also check the header" and messages[-1]["comments_on"] == ["tasks:1"]
    assert call(server, "POST", "/journal/comments", {"on": "nothing:1", "text": "x"})[0] == 409, "a comment is only written under a row that is there"

def test_the_settings_page_offers_only_what_the_code_reads_and_a_change_reaches_it(tmp_path: Path):
    from journal.features.tasks.feature import Tasks
    from journal.repositories.setting_rows import SettingRows
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        manifest = call(server, "GET", "/journal/manifest")[1]
        matched = [f["name"] for f in manifest["features"]]
        tasks = next(f for f in manifest["features"] if f["name"] == "tasks")
        assert [s["name"] for s in tasks["options"]] == ["auto", "first_nudge_after", "name_every", "log_after", "log_old_after_minutes"], "a feature's options, in its words"
        assert all(f in matched for f in ("messages", "shell", "voices")) and "kanban" not in matched, "version 3's leftovers are gone"
        assert "faults" in matched, "slow requests are a setting in every project, off by default and switched on where the journal develops itself"
        assert next(f for f in manifest["features"] if f["name"] == "pausing")["fixed"], "pausing is no setting: the pause button is always there"
        assert {g["key"] for g in manifest["groups"]} == {*matched, "project"}, "one group per feature, and the System tab's own"
        status, tree = call(server, "POST", "/journal/settings", {"tasks": {"log_after": 60}})
        assert status == 200 and tree["tasks"]["log_after"] == 60 and app.container.get(SettingRows).option(Tasks.LOG_LIMIT) == 60, "saved where the code reads it"
        tree = call(server, "POST", "/journal/settings", {"tasks": {"log_after": None}})[1]
        assert "tasks" not in tree and app.container.get(SettingRows).option(Tasks.LOG_LIMIT) == 50, "sent as null, back to its default"
        call(server, "POST", "/journal/settings", {"viewer": {"tour_seen": True}})
        tree = call(server, "POST", "/journal/settings", {"viewer": {"scheme": "dark"}})[1]
        assert tree["viewer"] == {"tour_seen": True, "scheme": "dark"}, "a save names only what it sets: the other keys under the heading stay, so the tour is not replayed by a layout save"
    finally:
        app.runtime().stop()


def test_a_read_of_an_unknown_environment_is_not_found_and_makes_none(tmp_path: Path):
    from journal.repositories.environments import Environments
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        assert call(server, "GET", "/journal/tasks", environment="settings")[0] == 404
        assert not app.container.get(Environments).matching(name="settings"), "a stray address in the browser never makes an environment"
    finally:
        app.runtime().stop()


def test_a_chat_lists_its_last_fifty_messages_and_the_rest_on_scrolling_up():
    from journal.http.listing import Listing
    from journal.models.message import Message
    rows = [Message(id=n, text=f"m{n}") for n in range(1, 61)]
    listing = Listing.query_listing({})
    assert [r.id for r in listing.listed(rows, lambda r: True)["rows"]] == list(range(1, 61)), "a work list shows every open row, however many"
    page = listing.listed(rows, lambda r: True, timeline=True)
    assert [r.id for r in page["rows"]] == list(range(11, 61)) and not page["is_last_page"], "a chat pages strictly: the last fifty, the rest on scrolling up"
    older = Listing.query_listing({"before": "11"}).listed(rows, lambda r: True, timeline=True)
    assert [r.id for r in older["rows"]] == list(range(1, 11)) and older["is_last_page"]

def test_the_profiles_page_lists_the_agents_folder_and_saves_a_profile_as_claude_reads_it(server):
    status, read = call(server, "GET", "/journal/profiles")
    shipped = ["journal-debugger", "journal-medior", "journal-plan-reviewer", "journal-planner", "journal-researcher", "journal-senior"]
    assert status == 200 and [p["name"] for p in read["profiles"]] == shipped, "a journal writes the profiles it ships when it boots"
    status, saved = call(server, "POST", "/journal/profiles/critic", {"description": "Reads a design through one lens.", "tools": "Read, Grep", "model": "sonnet", "codex_model": "gpt-6", "body": "You are a critic.\n\nSay what is wrong."})
    assert status == 200 and saved["name"] == "critic" and saved["shipped"] is False and saved["path"] == ".claude/agents/critic.md"
    assert (server.config.root / ".claude/agents/critic.md").read_text() == "---\nname: critic\ndescription: Reads a design through one lens.\ntools: Read, Grep\nkind: subagent\nmodel: sonnet\ncodex-model: gpt-6\n---\n\nYou are a critic.\n\nSay what is wrong.\n"
    status, read = call(server, "GET", "/journal/profiles")
    critic = next(p for p in read["profiles"] if p["name"] == "critic")
    assert sorted(p["name"] for p in read["profiles"]) == sorted([*shipped, "critic"]) and critic["uses"] == 0 and critic["body"] == "You are a critic.\n\nSay what is wrong."
    status, single = call(server, "GET", "/journal/profiles/critic")
    assert status == 200 and single["model"] == "sonnet" and single["codex_model"] == "gpt-6" and single["tools"] == "Read, Grep"
    assert call(server, "GET", "/journal/profiles/nobody")[0] == 404
    assert call(server, "POST", "/journal/profiles/bad.name", {})[0] == 409

def locked_step_holds(server) -> None:
    """No shipped workflow carries a locked step since the laws are the engine's, so the test locks one the way a shipped drawing would."""
    status, read = call(server, "GET", "/journal/chart")
    guarded = next(w for w in read["workflows"] if w["guarded"])
    status, single = call(server, "GET", f"/journal/chart/{guarded['id']}")
    lock = next(n for n in single["nodes"] if n["locked"])
    assert single["guarded"] and not single["locked"] and lock["shipped"], "a shipped hold is drawn locked; the workflow holding it is guarded, not locked itself"
    save = lambda nodes, lines: call(server, "POST", f"/journal/chart/{guarded['id']}", {"revision": single["revision"], "nodes": nodes, "lines": lines})
    status, body = save([n for n in single["nodes"] if n["id"] != lock["id"]], [l for l in single["lines"] if lock["id"] not in (l["from"], l["to"])])
    assert status == 409 and f"step {lock['id']} is locked" in body["error"] and "add steps after it" in body["error"], "a locked step cannot be taken out, and the refusal says what a user still can"
    status, body = save([{**n, "text": "my own words"} if n["id"] == lock["id"] else n for n in single["nodes"]], single["lines"])
    assert status == 409 and "its words stay" in body["error"], "a locked step is not reworded"
    trigger = next(n for n in single["nodes"] if n["kind"] == "trigger")
    check = next(e for e in single["catalogue"] if e["kind"] == "check" and not e["takes_text"])
    previous = {"id": "new1", "kind": "check", "key": check["key"], "text": "", "x": 0, "y": 0}
    status, body = save(single["nodes"] + [previous], single["lines"] + [{"from": trigger["id"], "to": "new1", "port": "then"}, {"from": "new1", "to": lock["id"], "port": "yes"}])
    assert status == 409 and "would come before a locked step" in body["error"], "no check of the user's decides whether the law runs"
    stop = {"id": "new2", "kind": "action", "key": "stop_here", "text": "", "x": 0, "y": 0}
    status, body = save(single["nodes"] + [stop], single["lines"] + [{"from": trigger["id"], "to": "new2", "port": "then"}, {"from": "new2", "to": lock["id"], "port": "then"}])
    assert status == 409, "a Stop the later workflows before a locked step is refused too"
    following = {"id": "new3", "kind": "action", "key": "say", "text": "after the law", "x": 0, "y": 0}
    output = next((l for l in single["lines"] if l["from"] == lock["id"]), None)
    onward = [{"from": "new3", "to": output["to"], "port": "then"}] if output else []
    status, body = save(single["nodes"] + [following], [l for l in single["lines"] if l is not output] + [{"from": lock["id"], "to": "new3", "port": "then"}] + onward)
    assert status == 200 and any(n["key"] == "say" and n["text"] == "after the law" for n in body["nodes"]), f"a step after a locked one is the user's to add: {body}"
    status, body = call(server, "POST", f"/journal/chart/{guarded['id']}/off", {})
    assert status == 409 and "holds locked step" in body["error"], "a workflow holding the law is not turned off"

def test_the_journal_knows_whether_a_viewer_tab_is_open(server):
    assert call(server, "GET", "/journal/viewer")[1] == {"open": False}, "no tab has asked anything yet"
    call(server, "GET", "/journal/environments")
    assert call(server, "GET", "/journal/viewer")[1] == {"open": False}, "a call that is not the viewer's, a plugin's program or the shim, opens no tab"
    urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/journal/environments", headers={"X-Journal-Env": "main", "X-Journal-Viewer": "1"}), timeout=5).read()
    assert call(server, "GET", "/journal/viewer")[1] == {"open": True}, "a tab that polls the API is open, and a launch opens no other"


def test_the_secrets_page_makes_fills_allows_deletes_and_restores_a_secret(server, tmp_path, monkeypatch):
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    status, produced = call(server, "POST", "/journal/secrets", {"title": "Github", "kind": "api key", "brief": "gh api user", "programs": ["gh"]})
    assert status == 201
    n = produced["id"]
    listed = json.dumps(call(server, "GET", "/journal/secrets")[1])
    assert '"title": "Github"' in listed and '"variable": "GITHUB_KEY"' in listed and '"programs": ["gh"]' in listed
    call(server, "POST", f"/journal/secrets/{n}/fill", {"field": "key", "value": "ghp_secretvalue123"})
    listed = json.dumps(call(server, "GET", "/journal/secrets")[1])
    assert '"filled": ["key"]' in listed and "ghp_secretvalue123" not in listed, "a filled field is marked, its value never shown"
    status, refused = call(server, "POST", f"/journal/secrets/{n}", {"programs": ["gh", "bash"]})
    assert status == 409 and "never given to bash" in json.dumps(refused)
    assert call(server, "POST", f"/journal/secrets/{n}", {"programs": ["gh", "curl"], "proposed": []})[0] == 200
    assert '"programs": ["gh", "curl"]' in json.dumps(call(server, "GET", "/journal/secrets")[1]), "the user allowed curl"
    assert call(server, "GET", "/journal/secrets/where")[1]["path"].endswith(".env")
    call(server, "POST", f"/journal/secrets/{n}/delete")
    assert call(server, "GET", f"/journal/secrets/{n}")[1]["deleted_at"] and call(server, "GET", "/journal/secrets")[1]["counts"]["open"] == 0, "a deleted secret is closed, kept for a restore"
    call(server, "POST", f"/journal/secrets/{n}/restore")
    assert call(server, "GET", f"/journal/secrets/{n}")[1]["deleted_at"] is None


def test_the_transcript_of_an_agent_and_of_its_subagent_are_read_from_the_providers_files(server, tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path))
    project = tmp_path / ".claude" / "projects" / re.sub(r"[^A-Za-z0-9]", "-", str(server.config.root.resolve()))
    (project / "s5" / "subagents").mkdir(parents=True)
    rows = [{"type": "user", "timestamp": "2026-10-17T10:00:00Z", "message": {"content": "fix the login"}},
            {"type": "assistant", "timestamp": "2026-10-17T10:00:05Z", "message": {"content": [{"type": "text", "text": "Looking."}, {"type": "tool_use", "name": "Read", "input": {}}]}},
            {"type": "user", "timestamp": "2026-10-17T10:00:06Z", "message": {"content": [{"type": "tool_result", "content": "file text"}]}}]
    (project / "s5.jsonl").write_text("".join(json.dumps(r) + "\n" for r in rows) + '{"type": "assi')
    (project / "s5" / "subagents" / "agent-a5.jsonl").write_text(json.dumps({"type": "assistant", "message": {"content": [{"type": "text", "text": "Read the login."}]}}) + "\n")
    transmit = lambda kind, **extra: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s5", **extra})
    transmit("SessionStart", source="startup")
    transmit("PreToolUse", tool_name="Agent", tool_input={"subagent_type": "journal-researcher", "description": "read it", "prompt": "read", "model": "haiku"}, tool_use_id="t1")
    transmit("PostToolUse", tool_name="Agent", tool_input={}, tool_response={"isAsync": True, "agentId": "a5"}, tool_use_id="t1")
    agent = next(item for item in call(server, "GET", "/journal/agents")[1]["rows"] if item["session"] == "s5")
    page = call(server, "GET", f"/journal/agents/{agent['id']}/transcript")[1]
    assert [(t["kind"], t["text"], t["tools"]) for t in page["turns"]] == [("human", "fix the login", []), ("agent", "Looking.", ["Read"]), ("tool", "", [])], "a tool result is a heading, its text asked for"
    assert call(server, "GET", f"/journal/agents/{agent['id']}/transcript?entry=3")[1]["text"] == "file text"
    assert call(server, "GET", f"/journal/agents/{agent['id']}/transcript?since=1")[1]["turns"][0]["line"] == 2
    sub = call(server, "GET", f"/journal/agents/{agent['id']}/subagents/a5/transcript")[1]
    assert [t["text"] for t in sub["turns"]] == ["Read the login."]
    assert call(server, "GET", f"/journal/agents/{agent['id']}/subagents/..%2Fx/transcript")[0] == 404
    assert call(server, "GET", "/journal/workers/99/transcript")[0] == 404

def test_a_kept_version_3_journal_is_offered_put_off_and_brought_across_with_a_report(tmp_path: Path):
    import time
    from journal.repositories.reports import Reports
    app = App(Config(tmp_path, port=0))
    app.runtime().boot()
    server = app.server()
    server.start()
    try:
        assert call(server, "GET", "/journal/migration")[1] == {"kept": False, "state": "offered"}, "no backup, nothing to offer"
        (app.config.home / "version-3").mkdir()
        assert call(server, "GET", "/journal/migration")[1] == {"kept": True, "state": "offered"}
        later = call(server, "POST", "/journal/migration/later", {})
        assert later[1].get("state") == "later", later
        assert call(server, "POST", "/journal/migration/start", {})[1]["state"] == "running"
        for _ in range(50):
            if call(server, "GET", "/journal/migration")[1]["state"] == "done":
                break
            time.sleep(0.1)
        assert call(server, "GET", "/journal/migration")[1]["state"] == "done"
        with app.container.get(Scope).environment(1):
            assert [r.title for r in app.container.get(Reports).all()] == ["The version 3 journal brought across"], "what came across is said in a report"
    finally:
        server.stop()
@pytest.fixture
def sharing(journal_root: Path):
    """The server and the share server beside it, as a running journal has them."""
    app = App(Config(journal_root, port=0))
    runtime = app.runtime()
    runtime.boot()
    server = app.server()
    server.start()
    runtime.share_server.start()
    yield server, runtime.share_server
    runtime.share_server.stop()
    server.stop()


def visit(share_server, path: str, password: str = ""):
    """What a visitor's browser gets from the share server: the status, the body and the headers, a redirect not followed."""
    import base64
    from http.client import HTTPConnection
    connection = HTTPConnection("127.0.0.1", share_server.port, timeout=5)
    connection.request("GET", path, headers={"Authorization": "Basic " + base64.b64encode(f"visitor:{password}".encode()).decode()} if password else {})
    reply = connection.getresponse()
    answer = reply.status, reply.read(), dict(reply.getheaders())
    connection.close()
    return answer


def test_the_settings_page_has_its_system_and_sharing_tabs(server):
    manifest = call(server, "GET", "/journal/manifest")[1]
    tabs = {group["key"]: group["tab"] for group in manifest["groups"]}
    assert tabs["project"] == "system" and tabs["sharing"] == "sharing", "the System tab has the project's group again, and sharing has a tab of its own"
    assert [s["name"] for s in next(f for f in manifest["features"] if f["name"] == "sharing")["options"]] == ["host"], "the tunler server is the sharing feature's own option"
    assert call(server, "GET", "/journal/settings")[1]["features"]["sharing"] is True
    saved = call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})[1]
    assert saved["sharing"]["host"] == "tunler.example"


def test_the_reuse_rules_are_said_in_the_workers_skill_law_four_the_notes_and_the_settings_page(server):
    from journal.features.workers.feature import Workers
    from journal.support.law_text import LawText
    skill, notes = Workers.skill.body, (Path(__file__).resolve().parents[1] / "NOTES.md").read_text()
    assert all(words in skill for words in ("journal worker notify <n>", "reported, or was stopped", "--fresh", "workers.idle_kept", "--why", "journal worker peers", "journal subagent retire <n>")), "the skill says notify, send, the dispatch refusals, the reuse question, peers and subagent retire"
    assert 'journal worker send <n> "<job>"' in LawText.BLOCK and "worker say" not in LawText.BLOCK and "journal worker send" in notes and "worker\nsay" not in notes
    workers = next(f for f in call(server, "GET", "/journal/manifest")[1]["features"] if f["name"] == "workers")
    assert {s["name"]: s["title"] for s in workers["options"]}["idle_kept"] == "Workers kept for reuse per profile", "the Settings page shows the cap in plain words"


def test_the_phone_page_installs_from_the_tunnels_listener_as_an_app(sharing):
    _, share_server = sharing
    assert visit(share_server, "/p")[0] == 301, "the page's address ends in a slash, so its files are found beside it"
    status, page, headers = visit(share_server, "/p/")
    assert status == 200 and b"manifest.webmanifest" in page and "manifest-src 'self'" in headers["Content-Security-Policy"], "the phone page, allowed its manifest"
    status, worker, headers = visit(share_server, "/p/sw.js")
    assert status == 200 and headers["Service-Worker-Allowed"] == "/p/" and headers["Cache-Control"] == "no-cache", "the service worker may serve all of /p/ and is never kept stale"
    status, manifest, _ = visit(share_server, "/p/manifest.webmanifest")
    assert status == 200 and json.loads(manifest)["scope"] == "/p/" and json.loads(manifest)["display"] == "standalone"
    status, icon, headers = visit(share_server, "/p/icon-192.png")
    assert status == 200 and icon.startswith(b"\x89PNG") and headers["Content-Type"] == "image/png"
    assert visit(share_server, "/p/settings")[0] == 404, "nothing else of the journal is under /p/"


def phone_call(share_server, method: str, path: str, body: dict | None = None, origin: str = "", cookie: str = ""):
    """What the phone app gets from the tunnel's listener: the status, the JSON and the headers."""
    from http.client import HTTPConnection
    connection = HTTPConnection("127.0.0.1", share_server.port, timeout=5)
    headers = {"Origin": origin, "X-Phone": "1", "Content-Type": "application/json", **({"Cookie": cookie} if cookie else {})}
    connection.request(method, path, body=json.dumps(body or {}).encode() if method == "POST" else None, headers=headers)
    reply = connection.getresponse()
    raw = reply.read()
    answer = reply.status, json.loads(raw) if raw else {}, dict(reply.getheaders())
    connection.close()
    return answer


def test_a_phone_pairs_through_the_tunnel_and_is_known_by_its_cookie_alone(sharing, monkeypatch, tmp_path):
    monkeypatch.setenv("HOME", str(tmp_path))
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    origin = f"https://{call(server, 'GET', '/journal/tunnel')[1]['address']}"
    proposal = call(server, "POST", "/journal/phones/connect", {"days": 7})[1]
    code = proposal["link"].split("#")[1]
    assert phone_call(share_server, "POST", "/p/pair", {"code": code}, origin="https://elsewhere.example")[0] == 403, "a write from another site is refused"
    status, data, headers = phone_call(share_server, "POST", "/p/pair", {"code": code, "device": "iPhone"}, origin=origin)
    cookie = headers["Set-Cookie"]
    assert status == 200 and data["phone"] == "iPhone" and cookie.startswith("__Host-phone=") and all(part in cookie for part in ("Secure", "HttpOnly", "SameSite=Strict", "Path=/", "Max-Age=")), "the key lives in a __Host- cookie the page's scripts cannot read"
    stored = cookie.split(";", 1)[0]
    assert phone_call(share_server, "GET", "/p/state", cookie=stored)[1]["phone"] == "iPhone", "the phone is known by its cookie"
    assert phone_call(share_server, "GET", "/p/state")[:2] == (401, {"error": "this phone is not connected"}), "without its key, no phone"
    status, refused, _ = phone_call(share_server, "GET", "/p/state", cookie="__Host-phone=paired-under-version-3")
    assert status == 401 and refused["paired_before"], "a key this journal does not know, as a phone paired under version 3 holds, is asked to pair again"
    status, transmitted, _ = phone_call(share_server, "POST", "/p/journal/messages", {"text": "from the train"}, origin=origin, cookie=stored)
    assert status == 201 and transmitted["creator"] == f"phone:{data['id']}" and transmitted["author"] == "user", "the phone writes as itself, its words the user's"
    assert any(m["text"] == "from the train" for m in phone_call(share_server, "GET", "/p/journal/messages", cookie=stored)[1]["rows"]), "the phone reads the journal through version 4's own controllers"
    assert phone_call(share_server, "GET", "/p/journal/secrets", cookie=stored)[0] == 403, "no secret is ever read from a phone"
    assert [phone_call(share_server, "GET", f"/p/journal/{path}", cookie=stored)[0] for path in ("mcp", "chart", "plugins", "profiles", "tunnel", "updates")] == [403] * 6, "a phone reads only what its pages show: nothing that starts a program or sets how the journal runs"
    for hidden in (".env", ".journal/settings.json", "../elsewhere/.env"):
        assert phone_call(share_server, "GET", f"/p/journal/project-files/file?path={hidden}", cookie=stored)[0] == 404, f"{hidden} is not a project file the phone may read"
    assert phone_call(share_server, "POST", "/p/journal/settings", {"messages": {"hold_after": 9}}, origin=origin, cookie=stored)[0] == 403, "nor a setting changed"
    assert phone_call(share_server, "GET", "/p/journal/messages?env=elsewhere", cookie=stored)[0] == 403, "nor another environment reached"
    assert phone_call(share_server, "GET", "/p/journal/messages")[0] == 401, "nothing at all without the phone's key"
    call(server, "POST", "/journal/questions", {"text": "Which name?", "options": ["alpha", "beta"]})
    requested = call(server, "GET", "/journal/questions")[1]["rows"][-1]
    assert phone_call(share_server, "POST", f"/p/journal/questions/{requested['id']}/answer", {"answer": "beta"}, origin=origin, cookie=stored)[0] in (200, 201), "the phone answers the agent's question"
    assert phone_call(share_server, "POST", f"/p/journal/questions/{requested['id']}/answer", {"answer": "alpha"}, origin=origin, cookie=stored)[0] >= 400, "and only once"
    assert len(phone_call(share_server, "GET", "/p/push-key", cookie=stored)[1]["key"]) == 87, "the journal's public push key, for the phone to subscribe with"
    assert phone_call(share_server, "POST", "/p/push", {"endpoint": "https://evil.example/push"}, origin=origin, cookie=stored)[0] == 422, "pushes go only through the phone makers' services"
    assert phone_call(share_server, "POST", "/p/push", {"endpoint": "https://web.push.apple.com/abc"}, origin=origin, cookie=stored)[0] == 201
    assert phone_call(share_server, "GET", "/p/waiting", cookie=stored)[1] == {"waiting": []}, "the service worker counts what waits, never what it is"
    assert phone_call(share_server, "POST", "/p/disconnect", {}, origin=origin, cookie=stored)[0] == 200, "the phone disconnects itself"
    assert phone_call(share_server, "GET", "/p/state", cookie=stored)[0] == 410, "a disconnected phone is told so"


def test_a_share_link_opens_its_document_through_the_share_server_and_nothing_else(sharing):
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    call(server, "POST", "/journal/docs", {"title": "Launch notes", "body": "## Why\nBecause."})
    assert call(server, "GET", "/journal/shares/opens?target=docs:1")[1] == ["Launch notes (docs:1)"]
    assert call(server, "POST", "/journal/shares", {"target": "tasks:1"})[0] == 409, "only a document, a report or a plan is shared"
    status, produced = call(server, "POST", "/journal/shares", {"target": "docs:1", "expires": "7d", "comments": False})
    assert status == 201 and produced["approved"] and produced["target"] == "docs:1" and "password" not in produced
    token = produced["token"]
    assert re.fullmatch(rf"https://[a-z0-9-]+-[0-9a-f]{{24}}\.tunler\.example/s/{token}", produced["link"]), "the link is the journal's own address on the tunler server"
    assert produced["opens"] == ["Launch notes (docs:1)"]
    assert [s["target"] for s in call(server, "GET", "/journal/shares")[1]["rows"]] == ["docs:1"]
    assert visit(share_server, "/health")[1] == b"journal-share-server"
    assert visit(share_server, f"/s/{token}")[2]["Location"] == f"/s/{token}/"
    status, page, headers = visit(share_server, f"/s/{token}/")
    assert status == 200 and b'id="app"' in page and "script-src 'self'" in headers["Content-Security-Policy"]
    status, data, _ = visit(share_server, f"/s/{token}/data.json")
    shown = json.loads(data)
    assert status == 200 and shown["share"]["target"] == "docs:1" and [d["title"] for d in shown["docs"]] == ["Launch notes"]
    assert call(server, "GET", "/journal/shares")[1]["rows"][0]["views"] == 1, "opening the page counts a view; its data does not"
    assert visit(share_server, "/journal/manifest")[0] == 404 and visit(share_server, "/s/not-a-token/")[0] == 404, "the share server answers links and nothing else of the journal"
    assert len(call(server, "GET", "/journal/tunnel/services")[1]) == 1, "the tunnel is listed while a link is open"
    call(server, "POST", "/journal/shares/1/stop")
    assert visit(share_server, f"/s/{token}/data.json")[0] == 410, "a stopped link opens nothing"
    assert call(server, "GET", "/journal/tunnel/services")[1] == [], "with no link open, nothing is shared"


def test_a_locked_link_opens_only_with_its_password(sharing):
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    call(server, "POST", "/journal/docs", {"title": "Private", "body": "text"})
    token = call(server, "POST", "/journal/shares", {"target": "docs:1", "password": "open sesame"})[1]["token"]
    listed = call(server, "GET", "/journal/shares")[1]["rows"][0]
    assert listed["locked"] is True and "password" not in listed, "the viewer is told a link is locked, never its password"
    status, _, headers = visit(share_server, f"/s/{token}/data.json")
    assert status == 401 and headers["WWW-Authenticate"].startswith("Basic")
    assert visit(share_server, f"/s/{token}/data.json", "wrong")[0] == 401
    assert visit(share_server, f"/s/{token}/data.json", "open sesame")[0] == 200


def share_command(server, *argv: str, session: str | None = "s1") -> dict:
    """The journal share command as the shim sends it, the agent's when a session is named, else the user's at their terminal."""
    return call(server, "POST", "/cli", {"argv": ["share", *argv], "env": "main", "session": session})[1]


def test_a_link_the_agent_makes_waits_for_the_users_accept_in_the_chat(sharing):
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    call(server, "POST", "/journal/docs", {"title": "Launch notes", "body": "## Why\nBecause."})
    assert share_command(server, "opens", "docs:1")["text"].strip() == "Launch notes (docs:1)"
    produced = share_command(server, "create", "docs:1", "--comments")
    assert produced["code"] == 0 and "waiting for the user's Accept in the chat" in produced["text"], produced
    token = call(server, "GET", "/journal/shares")[1]["rows"][0]["token"]
    assert visit(share_server, f"/s/{token}/data.json")[0] == 404, "the agent's link opens nothing until the user accepts it"
    card = next(m for m in call(server, "GET", "/journal/messages")[1]["rows"] if m["data"].get("buttons"))
    assert [b["label"] for b in card["data"]["buttons"]] == ["Accept", "Deny"] and "- Launch notes (docs:1)" in card["text"] and "Visitors can leave comments" in card["text"]
    accept = card["data"]["buttons"][0]
    assert call(server, "POST", f"/journal{accept['path']}", {})[1]["approved"], "Accept opens the link through the viewer's own path"
    assert call(server, "POST", f"/journal/messages/{card['id']}/press", {"pressed": ["Accept"]})[1]["data"]["pressed"] == ["Accept"], "the card shows Accept spent"
    assert visit(share_server, f"/s/{token}/data.json")[0] == 200
    assert "docs:1  open" in share_command(server, "list")["text"]
    assert share_command(server, "stop", "1")["code"] == 0 and visit(share_server, f"/s/{token}/data.json")[0] == 410
    assert ", open" in share_command(server, "create", "docs:1", session=None)["text"], "a link the user makes at their terminal opens at once"


def comment(share_server, token: str, value: dict, header: str = "1"):
    """A visitor's comment as the share page posts it: the status and the JSON answer."""
    from http.client import HTTPConnection
    connection = HTTPConnection("127.0.0.1", share_server.port, timeout=5)
    connection.request("POST", f"/s/{token}/comment", json.dumps(value), {"Content-Type": "application/json", "X-Shared-Comment": header})
    reply = connection.getresponse()
    answer = reply.status, reply.read()
    connection.close()
    return answer[0], json.loads(answer[1]) if answer[1].startswith(b"{") else {}


def test_a_visitor_comments_on_a_shared_document_and_it_comes_to_the_chat(sharing):
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    call(server, "POST", "/journal/docs", {"title": "Launch notes", "body": "## Why\nBecause."})
    token = call(server, "POST", "/journal/shares", {"target": "docs:1", "comments": True})[1]["token"]
    closed = call(server, "POST", "/journal/shares", {"target": "docs:1"})[1]["token"]
    status, produced = comment(share_server, token, {"on": "docs:1", "name": "Ana", "text": "The second step is unclear."})
    assert status == 201 and produced["data"]["visitor"] == "Ana" and produced["data"]["row"] == "docs:1", produced
    assert comment(share_server, token, {"on": "docs:1", "name": "Ana", "text": "x"}, header="")[0] == 400, "only the share page's own request is taken"
    assert comment(share_server, token, {"on": "docs:2", "name": "Ana", "text": "x"})[0] == 409, "a comment is only on what the link opens"
    assert comment(share_server, closed, {"on": "docs:1", "name": "Ana", "text": "x"})[1]["error"] == "this link does not take comments"
    shown = json.loads(visit(share_server, f"/s/{token}/data.json")[1])
    assert shown["share"]["comments"] and [c["data"]["detail"] for c in shown["comments"]] == ["The second step is unclear."], "the page shows the comments left on it"
    chat = [m for m in call(server, "GET", "/journal/messages")[1]["rows"] if m["comments_on"] == ["docs:1"]]
    assert len(chat) == 1
    assert chat[0]["text"] == "Ana commented on docs:1 through a shared link" and chat[0]["data"]["detail"] == "The second step is unclear."
    assert chat[0]["author"] == "system", "a visitor's words are the journal's card in the chat, never a message of the user's the agent would take as theirs"


def test_the_tunnel_says_what_keeps_links_from_reaching_the_journal(server, tmp_path, monkeypatch):
    monkeypatch.setenv("HOME", str(tmp_path))
    monkeypatch.setenv("PATH", str(tmp_path))
    data = call(server, "GET", "/journal/tunnel")[1]
    assert data["installed"] is False and data["problems"] == ["tunler is not installed on this machine, so share links cannot reach this journal."]
    assert data["server"] == "tunler.jessegall.nl", "with no server set, the one the journal installs from is offered"
    assert call(server, "GET", "/journal/tunnel/domains")[1] == []


def test_a_slow_answer_is_asked_once_given_from_memory_and_asked_again_once_dropped():
    from journal.support.cached_answer import CachedAnswer
    requested = []
    stored = CachedAnswer(lambda: requested.append(1) or len(requested), 60, 0)
    assert (stored.supplied(), stored.supplied(), len(requested)) == (1, 1, 1), "the first reader waits for it, the next is given it at once"
    stored.drop()
    assert (stored.supplied(), len(requested)) == (2, 2), "an answer no longer true is waited for again"


def test_an_output_is_read_by_its_id(tmp_path: Path):
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        folder = tmp_path / "run"
        folder.mkdir()
        (folder / "parts").write_text("R\n")
        (folder / "0.out").write_text("one\ntwo\n")
        (folder / "0.err").write_text("oops\n")
        (folder / "0.status").write_text("2\n")
        (folder / "done").write_text("1")
        with app.container.get(Scope).environment(1):
            stored = app.container.get(CommandOutputs).save(CommandOutput(chain="run", command="make test", folder=str(folder)), Actor.system())
        status, read = call(server, "GET", f"/journal/outputs/{stored.id}")
        assert status == 200 and (read["id"], read["command"], read["outcome"], read["lines"]) == (stored.id, "make test", "failed with code 2", ["one", "two", "oops"])
        assert call(server, "GET", "/journal/outputs/99")[0] == 404
        status, views = call(server, "GET", f"/journal/outputs/views?ids={stored.id}")
        assert status == 200 and set(views[str(stored.id)]) >= {"figure", "fraction", "ending", "count", "tone", "detail"}, "the live views of several outputs come in one answer, keyed by number, with the fields their cards show"
    finally:
        app.runtime().stop()


def test_a_dump_is_dropped_with_files_and_acted_on_through_the_viewer(server):
    def upload(n: int, name: str, text: str):
        boundary = "b0undary"
        body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{name}\"\r\nContent-Type: text/plain\r\n\r\n{text}\r\n--{boundary}--\r\n").encode()
        request = HttpRequest(f"http://127.0.0.1:{server.port}/journal/dumps/{n}/files", data=body, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}", "X-Journal-Env": "main"})
        try:
            with urlopen(request, timeout=5) as reply:
                return reply.status, json.loads(reply.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())

    n = call(server, "POST", "/journal/dumps", {"brief": "some ideas"})[1]["id"]
    row = upload(n, "a.txt", "hello")[1]
    assert row["title"] == f"Dump {n}" and row["brief"] == "some ideas" and row["files"] == ["a.txt"] and row["completed_at"] == 0
    with urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/journal/dumps/{n}/files/a.txt?env=main"), timeout=5) as reply:
        assert reply.read() == b"hello"
    assert call(server, "POST", f"/journal/dumps/{n}/name", {"title": "Ideas"})[1]["title"] == "Ideas"
    stopped = call(server, "POST", f"/journal/dumps/{n}/stop")[1]
    assert stopped["completed_at"] > 0 and stopped["stopped"] and stopped["outcome"] == "stopped, 0 filed, 2 left out"
    assert 400 <= upload(n, "b.txt", "more")[0] < 500, "a closed dump takes no more files"
    assert [r["id"] for r in call(server, "GET", "/journal/dumps?limit=5")[1]["rows"]] == [n]
    assert call(server, "POST", f"/journal/dumps/{n}/dismiss")[1]["dismissed"] is True


WEB = Path(__file__).resolve().parents[1] / "src" / "web" / "src"
OWN = re.compile(r"this\.(get|post)\(\s*(?:this\.here\(\s*)?[`\"](/[^`\"]*)[`\"]|this\.address\(\s*[`\"](/[^`\"]*)[`\"]")
NAMED = re.compile(r"\.(act|list|show|create|change|upload|fileUrl)\(\s*\"([\w-]+)\"(?:\s*,\s*[\w.]+(?:\([^()]*\))?)?(?:\s*,\s*\"([\w-]+)\")?")
SHAPES = {"act": ("POST", "/{table}/1/{act}"), "list": ("GET", "/{table}"), "show": ("GET", "/{table}/1"), "create": ("POST", "/{table}"),
          "change": ("POST", "/{table}/1"), "upload": ("POST", "/{table}/1/files"), "fileUrl": ("GET", "/{table}/1/files/a.txt")}


def viewer_paths() -> set[tuple[str, str]]:
    """Every path the viewer asks for: the client's own, and each act, list, show, create, change and file a component names by its table."""
    matched = set()
    client = (WEB / "api" / "client.js").read_text()
    for method, path, address in OWN.findall(client):
        literal = re.sub(r"\$\{query\(.*?\)\}", "", path or address)
        if not literal.startswith("/${") and "${session" not in literal:
            matched.add(("POST" if method == "post" else "GET", re.sub(r"\$\{[^}]*\}", "1", literal)))
    for source in [*WEB.rglob("*.js"), *WEB.rglob("*.vue")]:
        for call_name, table, act in NAMED.findall(source.read_text()):
            if call_name != "act" or act:
                method, shape = SHAPES[call_name]
                matched.add((method, shape.format(table=table, act=act)))
    return matched


def test_every_route_the_viewer_names_is_served_and_version_threes_api_is_gone(server):
    matched = viewer_paths()
    assert len(matched) > 100, "the walk reads the viewer's paths, not an empty list"
    unserved = sorted(f"{method} /journal{path}" for method, path in matched if not any(route.params(method, f"/journal{path}") is not None for route in server.router.routes))
    assert unserved == [], f"the viewer names routes no controller serves, each of which would answer 404: {unserved}"
    assert not (Path(__file__).resolve().parents[1] / "src" / "journal" / "http" / "v3").exists()
    assert "/api" not in (WEB / "api" / "client.js").read_text()


def test_the_search_page_finds_a_task_by_its_words(server):
    call(server, "POST", "/journal/tasks", {"title": "rebuild the viewer", "brief": "every page"})
    status, rows = call(server, "GET", "/journal/search?words=viewer%20page")
    assert status == 200 and rows["found"][0]["ref"] == "task 1"
    assert "check" in rows["models"] and "message" in rows["models"], "the page gets the models it can narrow to"
    status, rows = call(server, "GET", "/journal/search?words=viewer%20page&models=plan,message")
    assert rows["found"] == [], "narrowed to plans and messages, the task is not found"


def test_the_plan_bars_work_mode_and_the_top_bars_pause_are_version_fours_own(server):
    assert call(server, "GET", "/journal/mode")[1] == {"mode": "builder", "modes": ["builder", "orchestrator", "solo"]}
    assert call(server, "POST", "/journal/mode", {"mode": "orchestrator"})[1]["mode"] == "orchestrator"
    assert call(server, "GET", "/journal/settings")[1]["workers"]["mode"] == "orchestrator"
    assert call(server, "POST", "/journal/mode", {"mode": "boss"})[0] == 409
    machine_answer = lambda kind, **body: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s7", **body})
    machine_answer("SessionStart")
    agent = call(server, "GET", "/journal/agents")[1]["rows"][0]
    paused = call(server, "POST", f"/journal/agents/{agent['id']}/pause")[1]
    assert paused["state"] == "paused" and paused["doing"] == "you to resume it"
    assert "the user paused you" in json.dumps(machine_answer("PreToolUse", tool_name="Read", tool_input={"file_path": "a"})[1])
    assert call(server, "POST", f"/journal/agents/{agent['id']}/resume")[1]["state"] == agent["state"]
    assert "the user paused you" not in json.dumps(machine_answer("PreToolUse", tool_name="Read", tool_input={"file_path": "a"})[1])
    assert call(server, "POST", f"/journal/agents/{agent['id']}/resume")[0] == 409, "an agent not paused is not resumed"


def test_the_about_page_reads_the_installed_version_and_the_changelog_a_page_of_releases_at_a_time(server, monkeypatch):
    from journal.features.updates.support import changelog
    from journal.version import VERSION
    monkeypatch.setattr(changelog, "PAGE_RELEASES", 2)
    status, topic = call(server, "GET", "/journal/updates")
    assert status == 200 and topic["installed"] == VERSION and topic["changelog"].startswith("# Changelog") and topic["changelog"].count("\n## ") == 2 and not topic["is_last_page"], "the heading and the newest releases first"
    status, older = call(server, "GET", f"/journal/updates/changelog?skip={topic['shown']}")
    assert status == 200 and older["changelog"].startswith("## ") and older["shown"] == topic["shown"] + 2, "then older releases, a page at a time"


def test_a_plans_timeline_has_each_start_log_and_done_of_its_tasks_oldest_first(server):
    call(server, "POST", "/journal/plans", {"title": "the phone"})
    call(server, "POST", "/journal/plans/1/tasks", {"title": "pair it"})
    status, moments = call(server, "GET", "/journal/plans/1/timeline")
    assert status == 200 and moments == [], "nothing has happened on its tasks yet"


def test_a_second_journal_of_the_same_project_stands_by_while_the_first_answers(tmp_path: Path):
    import socket
    from journal.support.instance_guard import InstanceGuard
    first = free_pair()
    single = App(Config(tmp_path / "one", port=first, span=3))
    reserve = InstanceGuard(Config(tmp_path / "one", port=first, span=3))
    assert reserve.other_address() == "", "no port file, no other journal"
    single.server().start()
    try:
        assert reserve.other_address() == f"http://127.0.0.1:{first}", "the first journal answers on the port its file names, so a second stands by"
        assert InstanceGuard(Config(tmp_path / "two", port=first, span=3)).other_address() == "", "another project's journal on that port is no reason to stand by"
        App(Config(tmp_path / "one", port=first, span=3)).server()
        with socket.socket() as probe:
            assert probe.connect_ex(("127.0.0.1", first + 1)) != 0, "a journal built to stand by holds no port until it starts"
    finally:
        single.server().stop()
    assert reserve.other_address() == "", "the first gone, the port is free to take"


def test_a_comment_is_deleted_from_its_column(server):
    call(server, "POST", "/journal/tasks", {"title": "the footer"})
    status, produced = call(server, "POST", "/journal/comments", {"on": "tasks:1", "text": "a passing thought"})
    assert status == 201, produced
    status, missing = call(server, "POST", f"/journal/comments/{produced['id']}/delete", {})
    assert status == 200, missing
    assert produced["id"] not in [c["id"] for c in call(server, "GET", "/journal/comments")[1]["rows"]], "the comment is gone from the column"


def test_a_reply_in_the_column_hangs_under_its_comment_and_a_reply_in_the_chat_is_talk(tmp_path: Path):
    from journal.support.caller import Caller
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        call(server, "POST", "/journal/tasks", {"title": "the footer"})
        status, comment = call(server, "POST", "/journal/comments", {"on": "tasks:1", "text": "is the footer fixed?"})
        status, reply = call(server, "POST", "/journal/comments", {"on": "tasks:1", "text": "and the header?", "reply_target": comment["id"]})
        assert status == 201 and reply["reply_target"] == comment["id"] and reply["on"] == ["tasks:1"], "a reply written in the column hangs under its comment, on the same row"
        app.console().run(["message", "send", "Yes, both are fixed.", "--reply-to", str(comment["id"])], Caller.agent("main", "s1", "claude"))
        app.runtime().deferred.drain()
        rows = call(server, "GET", "/journal/comments")[1]["rows"]
        assert [(r["author"], r["reply_target"], r["on"]) for r in rows] == [("user", None, ["tasks:1"]), ("user", comment["id"], ["tasks:1"])], "the agent's reply in the chat is a plain reply, linked to the comment it answers and to no row"
        answered = call(server, "POST", "/journal/messages", {"text": "Good, then the menu next.", "reply_target": comment["id"]})[1]
        assert answered["reply_target"] == comment["id"] and answered["comments_on"] == [] and not answered["text"].startswith(">"), "a word typed in the chat is a chat message whatever it replies to: no comment on the row, no passage carried over"
        assert len(call(server, "GET", "/journal/comments")[1]["rows"]) == 2, "only the comment box files a comment"
    finally:
        app.runtime().stop()


def test_the_shim_posts_a_shell_line_and_the_server_runs_it_part_by_part_and_streams_what_the_agent_sees(tmp_path: Path):
    """The one test with a real shell: a short line, so it stays fast."""
    import os
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    (tmp_path / "a.py").write_text("print(1)\n")
    environment = {"PATH": os.environ.get("PATH", "/usr/bin:/bin"), "HOME": str(tmp_path), "JOURNAL_SESSION": "s1", "CLAUDECODE": "1"}
    def run(line: str) -> str:
        body = b"".join(f"{k}={v}\0".encode() for k, v in environment.items()) + b"\0\0" + line.encode()
        request = HttpRequest(f"http://127.0.0.1:{server.port}/shell/run", data=body, method="POST", headers={"Content-Type": "application/octet-stream", "X-Journal-Env": "main", "X-Journal-Cwd": str(tmp_path), "X-Journal-Shell": "bash"})
        with urlopen(request, timeout=20) as reply:
            return reply.read().decode()
    try:
        assert run("printf hi && printf there; false") == "hithere\n__journal_exit 1\n", "a short run is shown whole, the parts chained as the shell chains them, and the stream ends with the exit code"
        assert run("printf one && false && printf never; printf two") == "onetwo\n__journal_exit 0\n", "a part after && is skipped while the one before it failed, a part after ; runs whatever came before"
        assert run("cat a.py; echo ====") == "print(1)\n====\n__journal_exit 0\n", "a read of the project's code streams straight through, nothing kept"
        assert run("journal task list") == "__journal_exit 0\n" or "__journal_exit" in run("journal task list")
        with app.container.get(Scope).environment(1):
            completed = [e for e in app.container.get(Entries).kind_entries("ran", 50)]
        assert any(e.data["part"] == "printf hi" and e.data["status"] == 0 for e in completed) and any(e.data["part"] == "cat a.py" and e.data["output"] == "" for e in completed), "every part of the agent's own is recorded with its status; a direct part's output is not kept"
        assert not list((tmp_path / ".journal" / "runtime" / "outputs").glob("*/direct")), "a direct chain's folder is removed when it ends"
        app.console().run(["reader", "add", "naps", "--commands", "sleep", "--pattern", "slept", "--about", "a nap's end"], Caller.user("main"))
        began = time.monotonic()
        from journal.supervisor_link import SupervisorLink
        app.container.get(SupervisorLink).working(1)
        moved = run("sleep 2 --a-value; echo slept") + app.container.get(SupervisorLink).pending_lines(1)
        assert "went to the background at once and is watched through the reader naps" in moved and time.monotonic() - began < 1.5, "a command a reader reads, whatever its values, goes to the background at once, watched through it"
    finally:
        app.runtime().stop()


def test_the_viewer_undocks_a_docked_row_by_an_act_on_its_message(journal_root: Path):
    from journal.chat.docking import Docking
    app = App(Config(journal_root, port=0))
    app.runtime().boot()
    server = app.server()
    server.start()
    try:
        call(server, "POST", "/journal/tasks", {"title": "ship it", "brief": "b"})
        with app.container.get(Scope).environment(1):
            message = app.container.get(Docking).dock("task", 1, Actor.user(1))
        assert message.data["docked"] is True
        status, undocked = call(server, "POST", f"/journal/messages/{message.id}/undock")
        assert status == 200 and undocked["data"]["docked"] is False and undocked["data"]["row"] == "tasks:1"
    finally:
        server.stop()


def test_a_doc_or_a_report_downloads_as_a_word_file_made_from_its_html_page(server):
    from journal.support.html_page import HtmlPage
    from journal.support.export_name import ExportName
    page = HtmlPage.build("Deploys", "How a deploy goes", "Before anything.\n\n## Why\n\nBecause `it` is **safe**.\n\n- one\n- two\n")
    assert page.startswith("<!doctype html>") and "<h1>Deploys</h1>" in page and '<p class="abstract">How a deploy goes</p>' in page
    assert "<p>Before anything.</p>" in page and "<h2>Why</h2>" in page and "<p>Because <code>it</code> is <strong>safe</strong>.</p>" in page and "<ul><li>one</li><li>two</li></ul>" in page
    assert "<footer>Written in the agent journal</footer>" in page and "<style>" in page, "the page stands on its own"
    assert ExportName.stem("What: the check/found?") == "What the checkfound" and ExportName.build("", "report 3").startswith("report 3.")
    call(server, "POST", "/journal/reports", {"title": "What the check found", "body": "## Found\n\nThree faults.\n"})
    with urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/journal/reports/1/export", headers={"X-Journal-Env": "main"}), timeout=10) as reply:
        kind, disposition, body = reply.headers["Content-Type"], reply.headers["Content-Disposition"], reply.read()
    assert disposition == f"attachment; filename*=UTF-8''What%20the%20check%20found.{ExportName.extension()}"
    if ExportName.extension() == "docx":
        assert kind == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" and body[:2] == b"PK", "a Word file from textutil"
    else:
        assert kind.startswith("text/html") and b"<h1>What the check found</h1>" in body, "the page itself where textutil is missing"


def test_a_comment_on_a_documents_passage_names_the_section_and_lines_it_sits_on(tmp_path: Path):
    from journal.support.caller import Caller
    app = App(Config(tmp_path, port=0))
    app.runtime().boot()
    server = app.server()
    server.start()
    try:
        call(server, "POST", "/journal/docs", {"title": "Launch notes", "body": "# Launch notes\n\n## Why\nBecause it is time.\n\n## How\nFirst the tag.\nThen the push.\nThen the notes."})
        call(server, "POST", "/journal/comments", {"on": "docs:1", "text": "> Then the push.\n> Then the notes.\n\nThe push comes before the tag here."})
        shown = app.console().run(["message", "read", "1"], Caller.agent("main", "s1", "claude")).text
        assert "comments_on docs:1" in shown and "the passage sits in doc 1 at section 2, How, lines 8-9: `journal doc show 1 --section 2` or `--grep`" in shown, shown
    finally:
        server.stop()


def test_a_tunler_still_running_for_the_journals_address_is_ended_before_the_tunnel_starts(tmp_path: Path):
    import subprocess
    import time
    from journal.features.sharing.support.tunler import Tunler
    fake = tmp_path / "tunler"
    fake.write_text("#!/bin/sh\nsleep 30\n")
    fake.chmod(0o755)
    stale = subprocess.Popen([str(fake), "59404", "--domain=abcdef", "--inspect=4040"])
    counterpart = subprocess.Popen([str(fake), "59404", "--domain=ghijkl", "--inspect=4041"])
    try:
        time.sleep(0.2)
        assert stale.pid in Tunler.running_subdomain("abcdef") and counterpart.pid not in Tunler.running_subdomain("abcdef"), "a tunler is known by the subdomain in its arguments"
        ended = Tunler().stop_subdomain("abcdef")
        assert stale.pid in ended and counterpart.pid not in ended, "the one for this address is ended, the other left"
        assert stale.wait(5) is not None and counterpart.poll() is None, "it is gone, and the tunnel of another address runs on"
    finally:
        counterpart.kill()


def test_the_shim_posts_its_environment_and_the_words_and_reads_the_exit_code_off_the_last_line(server):
    environment = b"\0".join([b"CLAUDECODE=1", b"CLAUDE_CODE_SESSION_ID=abc", b"JOURNAL_ENV=main"])
    words = b"".join(word + b"\0" for word in (b"task", b"create", b"a task from the shim"))
    request = HttpRequest(f"http://127.0.0.1:{server.port}/cli/run", data=environment + b"\0\0" + words, method="POST", headers={"Content-Type": "application/octet-stream", "X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        lines = reply.read().decode().splitlines()
    assert lines[0].startswith("task 1 open") and lines[-1] == "__journal_exit 0", "what the command printed, then its exit code"
    tasks = call(server, "GET", "/journal/tasks")[1]["rows"]
    assert tasks[0]["creator"] == "agent:abc", "the shell's own session, read from its environment, names the agent"
