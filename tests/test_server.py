"""Phase three: the server answers real HTTP on a free port; tasks are created, read, started and finished over it."""

import json
import time
import re
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.support.where import Where


@pytest.fixture
def server(journal_root: Path):
    app = App(Config(journal_root, port=0))
    app.runtime().boot()
    server = app.server()
    server.start()
    yield server
    server.stop()


def call(server, method: str, path: str, body: dict | None = None, env: str = "main"):
    data = json.dumps(body).encode() if body is not None else None
    request = HttpRequest(f"http://127.0.0.1:{server.port}{path}", data=data, method=method, headers={"Content-Type": "application/json", "X-Journal-Env": env})
    try:
        with urlopen(request, timeout=5) as reply:
            return reply.status, json.loads(reply.read())
    except HTTPError as error:
        return error.code, json.loads(error.read())


def test_tasks_live_over_http(server):
    status, task = call(server, "POST", "/journal/tasks", {"title": "ship it", "brief": "b"})
    assert status == 201 and task["id"] == 1 and task["created_by"] == "user:1"
    status, started = call(server, "POST", "/journal/tasks/1/start")
    assert status == 200 and started["state"] == "started"
    assert call(server, "POST", "/journal/tasks/1/log", {"line": "halfway"})[0] == 201
    assert [log["line"] for log in call(server, "GET", "/journal/tasks/1/logs")[1]] == ["halfway"]
    status, done = call(server, "POST", "/journal/tasks/1/finish", {"how": "merged"})
    assert done["state"] == "done" and done["outcome"] == "merged"
    status, listed = call(server, "GET", "/journal/tasks")
    assert [t["title"] for t in listed["rows"]] == ["ship it"]
    for n in range(3):
        call(server, "POST", "/journal/tasks", {"title": f"more {n}"})
    page = call(server, "GET", "/journal/tasks?limit=2")[1]
    assert [t["title"] for t in page["rows"]] == ["more 0", "more 1", "more 2"] and page["more"], "the newest page, and every open task besides"
    closed = call(server, "GET", "/journal/tasks?closed=1")[1]
    assert [t["title"] for t in closed["rows"]] == ["ship it"] and closed["counts"] == {"all": 4, "open": 3, "unread": closed["counts"]["unread"]}
    assert call(server, "GET", "/journal/tasks", env="other")[0] == 404, "an environment nobody made is not found, never made by a read"
    call(server, "POST", "/journal/environments", {"name": "other"})
    assert call(server, "GET", "/journal/tasks", env="other")[1]["rows"] == []


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


def test_a_taken_port_sends_the_next_journal_to_the_next_one(tmp_path: Path):
    import socket
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        first = probe.getsockname()[1]
    one = App(Config(tmp_path / "one", port=first, span=3))
    two = App(Config(tmp_path / "two", port=first, span=3))
    one.server().start()
    two.server().start()
    try:
        assert one.server().port == first and two.server().port == first + 1
        assert (tmp_path / "two" / ".journal" / "port").read_text() == str(first + 1)
    finally:
        one.server().stop()
        two.server().stop()


def test_the_viewer_sees_reactions_and_subagent_marks(tmp_path: Path):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
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
        for kind, extra in (("SessionStart", {}), ("PreToolUse", {"tool_name": "Agent", "tool_input": {"description": "review the login", "prompt": "read the login flow and report", "subagent_type": "reviewer", "model": "sonnet"}}), ("PostToolUse", {"tool_name": "Agent", "tool_input": {}, "tool_response": "fine"})):
            urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s9", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        marks = lambda: [m["data"] for m in call(server, "GET", "/journal/messages?limit=200")[1]["rows"] if m["data"].get("kind") == "subagent"]
        for _ in range(50):
            if marks() and marks()[0]["state"] == "done":
                break
            time.sleep(0.1)
        assert [(c["detail"], c["agent_type"], c["state"]) for c in marks()] == [("review the login", "reviewer", "done")], "a subagent is a message in the chat, settled when it answers"
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
    assert [r["id"] for r in tasks["rows"]] == [3, 4] and tasks["more"] is True
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
    call(server, "POST", "/journal/tasks", {"title": "other's own"}, env="other")
    assert [r["title"] for r in call(server, "GET", "/journal/tasks")[1]["rows"]] == ["main's own"]
    assert [r["title"] for r in call(server, "GET", "/journal/tasks", env="other")[1]["rows"]] == ["other's own"]
    with pytest.raises(HTTPError) as refused:
        urlopen(f"http://127.0.0.1:{server.port}/journal/tasks", timeout=5)
    assert refused.value.code == 409 and "X-Journal-Env" in json.loads(refused.value.read())["error"]


def test_the_viewers_pages_read_the_shapes_they_expect(tmp_path: Path):
    """Settings answer with the whole tree, a read message is read and not closed, a running plan is active, a check carries its last run, a sequence its steps, the hub its counts, the Code page its files."""
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
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
        app.console().run(["message", "react", str(n), "🎉"], Where("main", "s1"))
        assert call(server, "GET", f"/journal/messages/{n}")[1]["answered"] is True, "a face from the agent answers it"
        app.console().run(["plan", "create", "p"], Where("main"))
        app.console().run(["plan", "approve", "1"], Where("main"))
        app.console().run(["plan", "start", "1"], Where("main", "s1"))
        assert call(server, "GET", "/journal/plans/1")[1]["state"] == "started"
        app.console().run(["check", "create", "truthy", "--command", "true"], Where("main"))
        app.console().run(["check", "run", "1"], Where("main"))
        check = call(server, "GET", "/journal/checks/1")[1]
        assert check["last_passed"] is True and "running" in check
        release = app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Where("main")).out.split()[1].rstrip(":")
        assert call(server, "GET", f"/journal/sequences/{release}")[1]["steps"] == ["tag", "push"]
        standing = call(server, "GET", "/journal/summary")[1]["environments"][0]
        assert {"messages", "tasks", "questions"} <= set(standing)
        (tmp_path / "hello.py").write_text("print('hi')\n")
        assert call(server, "GET", "/journal/project-files/file?path=hello.py")[1]["lines"] == 1
        assert "diff" in call(server, "GET", "/journal/project-files/diff?path=hello.py")[1]
        assert call(server, "GET", "/journal/project-files/find?q=hello")[1][0]["name"] == "hello.py"
        listed = call(server, "GET", f"/journal/messages?ids={n}")[1]["rows"]
        assert [r["id"] for r in listed] == [n]
    finally:
        app.runtime().stop()


def test_a_started_plans_phase_shown_advances_when_its_tasks_are_all_done(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        console, user, agent = app.console(), Where("main"), Where("main", "s1")
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
        console.run(["task", "done", "1"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 1, "a phase with a task still open is the one shown"
        console.run(["task", "done", "2"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 2, "every task of phase one done: phase two is shown"
        console.run(["task", "done", "3"], agent)
        assert call(server, "GET", "/journal/plans/1")[1]["current_phase"] == 2, "all done: the last phase"
    finally:
        app.runtime().stop()


def test_the_status_line_knows_what_the_agent_waits_for(tmp_path: Path):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        data = json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode()
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.console().run(["task", "create", "the footer", "--start"], Where("main", "s1"))
        held = call(server, "GET", "/journal/summary")[1]["environments"][0]["task"]
        assert held == {"id": 1, "title": "the footer", "awaiting": ""}
        app.console().run(["stuck", "stuck on the login"], Where("main", "s1"))
        agent = call(server, "GET", "/journal/agents")[1]["rows"][0]
        assert agent["awaiting"] == "stuck on the login" and agent["awaiting_since"]
        assert call(server, "GET", "/journal/summary")[1]["environments"][0]["task"]["awaiting"] == "stuck on the login"
    finally:
        app.runtime().stop()


def test_the_activity_rail_the_edits_pane_and_the_documents_read_true(tmp_path: Path, monkeypatch):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: typed.append({"verb": verb, **fields}["line"]))
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
    def hook(kind, **extra):
        return urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    try:
        hook("SessionStart")
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "k"})[1]["id"]
        app.console().run(["message", "read", str(n)], Where("main", "s1"))
        app.console().run(["task", "create", "t", "--start"], Where("main", "s1"))
        app.console().run(["task", "done", "1", "--how", "shipped"], Where("main", "s1"))
        entries = call(server, "GET", "/journal/entries?last=50")[1]
        assert any(e["kind"] == "updated" and e["data"]["table"] == "messages" and "read_at" in e["data"]["changed"] for e in entries)
        assert any(e["kind"] == "updated" and e["data"]["table"] == "tasks" and "finished_at" in e["data"]["changed"] for e in entries)
        assert any(e["kind"] == "SessionStarted" for e in entries)
        hook("PostToolUse", tool_name="Edit", tool_input={"file_path": str(tmp_path / "a.py"), "old_string": "x", "new_string": "y"}, tool_response={"structuredPatch": [{"oldStart": 7, "newStart": 7, "lines": [" before", "-x", "+y", " after"]}]})
        edit = call(server, "GET", "/journal/agents/1/edits")[1]["edits"][0]
        assert [r["kind"] for r in edit["rows"]] == ["ctx", "del", "add", "ctx"] and edit["first_line"] == 7 and edit["last_line"] == 9
        call(server, "POST", "/cli", {"argv": ["shell", "ran", "journal task list", "--chain", "c1", "--status", "0", "--output", "1 t"], "env": "main", "session": "s1", "agent": True})
        assert call(server, "GET", "/journal/agents/1/terminal")[1][-1]["tool"] == "Journal"
        assert call(server, "POST", "/journal/agents/1/shell", {"command": "ls"})[1]["queued"] is True and typed[-1] == "ls"
        doc = call(server, "POST", "/journal/docs", {"title": "Design", "body": "Intro\n\n## Goals\n\nShip it"})[1]
        doc = call(server, "POST", f"/journal/docs/{doc['id']}/section", {"title": "Risks", "body": "None"})[1]
        assert doc["body"].endswith("## Risks\n\nNone\n") and "## Goals" in doc["body"]
        assert call(server, "POST", f"/journal/docs/{doc['id']}", {"title": "Design v2"})[1]["title"] == "Design v2"
        app.console().run(["task", "create", "later", "--start"], Where("main", "s1"))
        app.console().run(["task", "park", "2", "waiting"], Where("main", "s1"))
        assert call(server, "GET", "/journal/tasks/2")[1]["state"] == "parked"
    finally:
        app.runtime().stop()


def test_the_remaining_pages_act_through_the_viewer(tmp_path: Path):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        app.console().run(["plan", "create", "p"], Where("main"))
        assert call(server, "POST", "/journal/plans/1/finish", {})[1]["state"] == "done"
        app.console().run(["check", "create", "truthy", "--command", "true"], Where("main"))
        assert call(server, "POST", "/journal/checks/1/run", {})[1]["running"]["at"], "the page's run answers at once, the check running"
        ran = lambda: call(server, "GET", "/journal/checks?ids=1")[1]["rows"][0]
        for _ in range(50):
            if not ran()["running"]:
                break
            time.sleep(0.1)
        assert ran()["last_passed"] is True, "and its result lands on the row"
        assert call(server, "POST", "/journal/checks/1", {"every": 5})[1]["every"] == 5
        release = app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Where("main")).out.split()[1].rstrip(":")
        assert call(server, "POST", f"/journal/sequences/{release}/steps", {"steps": ["tag", "test", "push"]})[1]["steps"] == ["tag", "test", "push"]
        app.console().run(["trigger", "create", "deploy", "say so"], Where("main"))
        updated = call(server, "POST", "/journal/triggers/1", {"words": ["deploy", "release"], "action": "deny", "text": "wait"})[1]
        assert updated["words"] == ["deploy", "release"] and updated["action"] == "deny"
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
        assert entries and entries[-1]["data"]["table"] == "messages", "an id from a journal that was reset still gets the recent entries"
    finally:
        app.runtime().stop()


def test_the_agent_bars_pickers_type_the_providers_command_and_a_reply_names_what_it_answers(tmp_path: Path, monkeypatch):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, verb, fields: typed.append({"verb": verb, **fields}["line"]))
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        controls = call(server, "GET", "/journal/agents/controls/claude?model=opus&effort=high")[1]
        assert [g["key"] for g in controls["groups"]] == ["model", "effort", "context"] and controls["groups"][0]["current"] == "opus"
        n = call(server, "POST", "/journal/messages", {"text": "is the footer fixed?\nand the header?", "idempotency": "q"})[1]["id"]
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        assert call(server, "POST", "/journal/agents/1/control", {"action": "effort", "value": "max"})[1]["queued"] is True and typed[-1] == "/effort max"
        assert call(server, "POST", "/journal/agents/1/control", {"action": "model", "value": "gpt"})[0] == 409
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": "MessageDisplay", "session_id": "s1", "message": f"[!reply:{n}]\nBoth are."}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        reply = call(server, "GET", "/journal/messages")[1]["rows"][-1]
        assert reply["text"] == "Both are." and reply["reply_to"] == n
    finally:
        app.runtime().stop()


def test_a_users_message_and_the_agents_reply_to_it_are_two_message_rows(tmp_path: Path):
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "c1"})[1]["id"]
        for kind, extra in (("SessionStart", {}), ("MessageDisplay", {"message": f"[!reply:{n}]\nHello back."})):
            urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        rows = [r for r in call(server, "GET", "/journal/messages")[1]["rows"] if n in (r["id"], r["reply_to"])]
        assert [(r["author"], r["reply_to"], r["text"]) for r in rows] == [("user", None, "hello"), ("agent", n, "Hello back.")]
        assert rows[0]["created_by"].startswith("user") and rows[1]["created_by"] == "agent:s1" and rows[1]["acknowledgement"] is False
        assert call(server, "GET", "/journal/comments")[1]["rows"] == [], "a reply is no comment"
    finally:
        app.runtime().stop()


def test_the_message_stream_holds_the_users_words_the_agents_and_the_systems_cards_by_number(tmp_path: Path):
    from journal.support.cards import Cards
    from journal.support.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        n = call(server, "POST", "/journal/messages", {"text": "hello", "idempotency": "c1"})[1]["id"]
        for kind, extra in (("SessionStart", {}), ("MessageDisplay", {"message": f"[!reply:{n}]\nHello back."})):
            urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        app.container.get(Cards).show(1, "s1", "Check lint passed", "check", "good", "all clean", "checks:3")
        rows = [r for r in call(server, "GET", "/journal/messages")[1]["rows"] if r["id"] >= n]
        assert [r["id"] for r in rows] == sorted(r["id"] for r in rows)
        assert [(r["author"], r["text"]) for r in rows] == [("user", "hello"), ("agent", "Hello back."), ("system", "Check lint passed")]
        card = rows[-1]
        assert card["created_by"] == "system"
        assert card["data"] == {"kind": "card", "session": "s1", "icon": "check", "tone": "good", "detail": "all clean", "row": "checks:3", "command": "", "key": ""}
    finally:
        app.runtime().stop()


def test_the_board_is_off_and_stays_off(server):
    assert "kanban" not in call(server, "GET", "/journal/settings")[1]["features"]
    assert "kanban" not in call(server, "POST", "/journal/settings", {"features": {"kanban": True}})[1]["features"], "a switch of a feature version 4 does not have is not kept"


def test_a_comment_written_under_a_task_in_the_viewer_is_the_users_message_linked_to_it(server):
    from journal.support.where import Where
    call(server, "POST", "/journal/tasks", {"title": "the footer"})
    status, made = call(server, "POST", "/journal/comments", {"on": "tasks:1", "text": "please also check the header"})
    assert status == 201 and made["on"] == ["tasks:1"] and made["text"] == "please also check the header"
    assert [(r["on"], r["author"]) for r in call(server, "GET", "/journal/comments")[1]["rows"]] == [(["tasks:1"], "user")]
    messages = call(server, "GET", "/journal/messages")[1]["rows"]
    assert messages[-1]["text"] == "please also check the header" and messages[-1]["comments_on"] == ["tasks:1"]
    assert call(server, "POST", "/journal/comments", {"on": "nothing:1", "text": "x"})[0] == 409, "a comment is only written under a row that is there"


def test_the_manifest_names_the_workflow_node_that_reads_each_setting_and_says_when_none_does(server):
    manifest = call(server, "GET", "/journal/manifest")[1]
    feature = lambda name: next(f for f in manifest["features"] if f["name"] == name)
    hold_after = next(s for s in feature("messages")["options"] if s["name"] == "hold_after")
    assert hold_after["read_by"] and {r["workflow"] for r in hold_after["read_by"]} == {"Hold the tools while a read message stays unanswered"} and all(r["id"] > 0 for r in hold_after["read_by"]), "the guards' workflow has the check that reads the hold cadence"
    auto = next(s for s in feature("tasks")["options"] if s["name"] == "auto")
    assert auto["read_by"] == [], "the auto switch is read by the auto_mode check, which names no setting in its text"


def test_the_settings_page_offers_only_what_the_code_reads_and_a_change_reaches_it(tmp_path: Path):
    from journal.features.tasks.feature import Tasks
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        manifest = call(server, "GET", "/journal/manifest")[1]
        named = [f["name"] for f in manifest["features"]]
        tasks = next(f for f in manifest["features"] if f["name"] == "tasks")
        assert [s["name"] for s in tasks["options"]] == ["auto", "first_nudge_after", "name_every", "log_after"], "a feature's options, in its words"
        assert all(f in named for f in ("messages", "shell", "voices")) and "kanban" not in named, "version 3's leftovers are gone"
        assert {g["key"] for g in manifest["groups"]} == {*named, "project"}, "one group per feature, and the System tab's own"
        status, tree = call(server, "POST", "/journal/settings", {"tasks": {"log_after": 60}})
        assert status == 200 and tree["tasks"]["log_after"] == 60 and app.container.get(Settings).option(Tasks.LOG_AFTER) == 60, "saved where the code reads it"
        tree = call(server, "POST", "/journal/settings", {"tasks": {}})[1]
        assert "tasks" not in tree and app.container.get(Settings).option(Tasks.LOG_AFTER) == 50, "dropped from the page, back to its default"
    finally:
        app.runtime().stop()


def test_a_read_of_an_unknown_environment_is_not_found_and_makes_none(tmp_path: Path):
    from journal.repositories.environments import Environments
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        assert call(server, "GET", "/journal/tasks", env="settings")[0] == 404
        assert not app.container.get(Environments).where(name="settings"), "a stray address in the browser never makes an environment"
    finally:
        app.runtime().stop()


def test_a_chat_lists_its_last_fifty_messages_and_the_rest_on_scrolling_up():
    from journal.http.listing import Listing
    from journal.models.message import Message
    rows = [Message(id=n, text=f"m{n}") for n in range(1, 61)]
    listing = Listing.from_query({})
    assert [r.id for r in listing.listed(rows, lambda r: True)["rows"]] == list(range(1, 61)), "a work list shows every open row, however many"
    page = listing.listed(rows, lambda r: True, timeline=True)
    assert [r.id for r in page["rows"]] == list(range(11, 61)) and page["more"], "a chat pages strictly: the last fifty, the rest on scrolling up"
    older = Listing.from_query({"before": "11"}).listed(rows, lambda r: True, timeline=True)
    assert [r.id for r in older["rows"]] == list(range(1, 11)) and not older["more"]


def test_a_hold_a_trigger_reaches_through_no_check_is_refused_and_a_wait_with_no_release_is_flagged(server):
    status, read = call(server, "GET", "/journal/chart")
    awaiting = next(w for w in read["workflows"] if w["state"] == "awaiting" and w["event"] == "workers.updated" and w["title"].startswith("Send the agent back"))
    assert status == 200 and awaiting["warnings"] == [], "the shipped wait releases the agent"
    nodes = [{"id": "t", "kind": "trigger", "key": "workers.updated"}, {"id": "h", "kind": "action", "key": "hold", "text": "wait"}]
    status, body = call(server, "POST", f"/journal/chart/{awaiting['id']}", {"revision": awaiting["revision"], "nodes": nodes, "lines": [{"from": "t", "to": "h"}]})
    assert status == 409 and "action h holds the agent at every workers.updated: put a check before it" in body["error"]
    nodes = [{"id": "t", "kind": "trigger", "key": "workers.updated"}, {"id": "s", "kind": "action", "key": "say", "text": "still waiting"}]
    status, saved = call(server, "POST", f"/journal/chart/{awaiting['id']}", {"revision": awaiting["revision"], "nodes": nodes, "lines": [{"from": "t", "to": "s"}]})
    assert status == 200 and saved["warnings"] == ["nothing ends this wait: no workflow of Waiting on a worker releases the agent or changes its state, so an agent waiting on a worker stays so until you release it by hand"]



def test_a_shipped_workflow_cannot_be_deleted_and_an_emptied_one_reads_off(server):
    status, read = call(server, "GET", "/journal/chart")
    base = next(w for w in read["workflows"] if w["shipped"] and not w["guarded"])
    assert status == 200 and not base["off"], "a shipped workflow with its drawing answers its events"
    status, body = call(server, "POST", f"/journal/chart/{base['id']}/remove", {})
    assert status == 409 and "empty it or reset it" in body["error"], "a shipped workflow stays"
    status, saved = call(server, "POST", f"/journal/chart/{base['id']}", {"revision": base["revision"], "nodes": [], "lines": []})
    assert status == 200 and saved["nodes"] == []
    status, read = call(server, "GET", "/journal/chart")
    assert next(w for w in read["workflows"] if w["id"] == base["id"])["off"], "an emptied workflow answers nothing and reads off"


def test_the_page_reads_states_with_parents_flags_per_workflow_turns_one_off_and_on_and_lists_recent_runs(server):
    status, read = call(server, "GET", "/journal/chart")
    states = {s["key"]: s for s in read["states"]}
    assert states["following_plan"]["parent"] == "working" and states["working"]["parent"] == "" and states["idle"]["title"] == "Idle"
    assert read["states"][0]["key"] == "idle" and set(states) == {"idle", "working", "following_plan", "awaiting", "waiting", "expecting", "stuck", "ended", "sorting_dump", "paused"}, "the ten states the engine has, the first first; the pauses the agent owed are facts now"
    assert states["awaiting"]["title"] == "Waiting on a worker" and states["awaiting"]["parent"] == ""
    idle = next(w for w in read["workflows"] if w["shipped"] and not w["guarded"])
    assert idle["edited"] is False and idle["failed"] is False and idle["off"] is False
    status, off = call(server, "POST", f"/journal/chart/{idle['id']}/off", {})
    assert status == 200 and off["off"] is True and all(n["kind"] != "trigger" for n in off["nodes"]), "turned off: the trigger is gone, the rest stays"
    status, on = call(server, "POST", f"/journal/chart/{idle['id']}/on", {})
    assert status == 200 and on["off"] is False and [n["key"] for n in on["nodes"] if n["kind"] == "trigger"] == [idle["event"]], "turned on: the trigger of its event is back"
    assert on["edited"] is False, "a default turned off and on is still the default"
    stale = call(server, "POST", f"/journal/chart/{idle['id']}", {"revision": 0, "nodes": on["nodes"], "lines": on["lines"]})
    assert stale[0] == 409 and stale[1]["conflict"] is True and stale[1]["revision"] == on["revision"] and stale[1]["revised_by"] and stale[1]["revised_at"] > 0
    bad = [{"id": "t", "kind": "trigger", "key": idle["event"]}, {"id": "c", "kind": "check", "key": "flying"}]
    refused = call(server, "POST", f"/journal/chart/{idle['id']}", {"revision": on["revision"], "nodes": bad, "lines": [{"from": "t", "to": "c"}]})
    assert refused[0] == 409 and {f["node"] for f in refused[1]["faults"]} == {"c"} and any("check c has no line out" in f["words"] for f in refused[1]["faults"])
    assert {f["key"] for f in read["fillers"]} >= {"{{task}}", "{{inbox}}", "{{parked_tasks}}", "{{worker_name}}"} and all(f["about"] for f in read["fillers"])
    titles = {e["key"]: e["title"] for e in read["catalogue"] if e["kind"] == "trigger"}
    assert titles["task_logs.created"] == "Task log created" and titles["mcp_servers.updated"] == "MCP server updated" and titles["edits.deleted"] == "Edit deleted" and titles["nodes.created"] == "Workflow step created", "an event is named, not described"
    tried = {e["key"]: e["tried"] for e in read["catalogue"] if e["kind"] == "trigger"}
    assert tried["idle"] and tried["messages.created"] and tried["workers.updated"] and not tried["tasks.created"] and not tried["messages.deleted"]
    status, runs = call(server, "GET", "/journal/chart/runs?last=5")
    assert status == 200 and runs == {"runs": []}, "nothing walked yet in this journal"



    status, body = call(server, "POST", "/journal/chart", {"state": "idle", "trigger": "idle", "title": "Another stop"})
    assert status == 201 and body["place"] > 0, "a second workflow for the same state at the same event takes its place after the first"
    status, body = call(server, "POST", "/journal/chart", {"state": "", "trigger": "idle"})
    assert status == 201 and body["title"] == "New workflow" and body["state"] == "", "a workflow bound to no state always runs"
    status, body = call(server, "POST", "/journal/chart", {"state": "flying", "trigger": "idle", "title": "Flying"})
    assert status >= 400 and "no state is called flying" in json.dumps(body)
    status, made = call(server, "POST", "/journal/chart", {"state": "idle", "trigger": "tool_finished", "title": "After a tool"})
    assert status == 201 and made["state"] == "idle" and made["event"] == "tool_finished" and [n["key"] for n in made["nodes"]] == ["tool_finished"]
    moved = [{**node, "key": "idle"} for node in made["nodes"]]
    status, body = call(server, "POST", f"/journal/chart/{made['id']}", {"revision": made["revision"], "nodes": moved, "lines": []})
    assert status >= 400 and "this workflow is for tool_finished but holds no trigger of it" in json.dumps(body)




def test_the_profiles_page_lists_the_agents_folder_and_saves_a_profile_as_claude_reads_it(server, journal_root):
    status, read = call(server, "GET", "/journal/profiles")
    assert status == 200 and read == {"profiles": []}, "a fresh journal has no agents folder yet"
    status, saved = call(server, "POST", "/journal/profiles/critic", {"description": "Reads a design through one lens.", "tools": "Read, Grep", "model": "sonnet", "codex_model": "gpt-6", "body": "You are a critic.\n\nSay what is wrong."})
    assert status == 200 and saved["name"] == "critic" and saved["shipped"] is False and saved["path"] == ".claude/agents/critic.md"
    assert (journal_root / ".claude/agents/critic.md").read_text() == "---\nname: critic\ndescription: Reads a design through one lens.\ntools: Read, Grep\nkind: subagent\nmodel: sonnet\ncodex-model: gpt-6\n---\n\nYou are a critic.\n\nSay what is wrong.\n"
    status, read = call(server, "GET", "/journal/profiles")
    assert [p["name"] for p in read["profiles"]] == ["critic"] and read["profiles"][0]["uses"] == 0 and read["profiles"][0]["body"] == "You are a critic.\n\nSay what is wrong."
    status, one = call(server, "GET", "/journal/profiles/critic")
    assert status == 200 and one["model"] == "sonnet" and one["codex_model"] == "gpt-6" and one["tools"] == "Read, Grep"
    assert call(server, "GET", "/journal/profiles/nobody")[0] == 404
    assert call(server, "POST", "/journal/profiles/bad.name", {})[0] == 409


def test_an_events_workflows_are_put_in_order_by_the_user_and_a_stale_order_names_who_saved_first(server):
    status, read = call(server, "GET", "/journal/chart")
    stops = sorted([w for w in read["workflows"] if w["event"] == "idle"], key=lambda w: w["place"])
    status, mine = call(server, "POST", "/journal/chart", {"state": "", "trigger": "idle", "title": "Always at a stop"})
    assert status == 201 and mine["place"] > stops[-1]["place"], "a new workflow takes the last place of its event"
    rows = [{"id": w["id"], "revision": w["revision"]} for w in stops]
    status, body = call(server, "POST", "/journal/chart/order", {"trigger": "idle", "order": [{"id": mine["id"], "revision": mine["revision"]}] + rows})
    assert status == 200 and [w["id"] for w in body["workflows"]][0] == mine["id"] and body["workflows"][0]["place"] == 0, "dragged first, it runs first"
    moved = next(w for w in body["workflows"] if w["id"] == mine["id"])
    assert moved["revision"] == mine["revision"] + 1 and all(w["revision"] == r["revision"] + 1 for w, r in zip(body["workflows"][1:], rows)), "each workflow that moved has one more revision"
    status, body = call(server, "POST", "/journal/chart/order", {"trigger": "idle", "order": rows + [{"id": mine["id"], "revision": mine["revision"]}]})
    assert status == 409 and "changed since you read it" in body["error"] and "saved it first" in body["error"], "an order over a stale list is refused, naming who saved first"
    status, body = call(server, "POST", "/journal/chart/order", {"trigger": "idle", "order": [{"id": mine["id"], "revision": moved["revision"]}]})
    assert status == 409 and "name each once" in body["error"], "an order names every workflow of the event"
    status, body = call(server, "POST", "/journal/chart/order", {"trigger": "flying", "order": []})
    assert status == 409 and "no workflow answers flying" in body["error"]


def test_a_locked_step_stays_as_shipped_and_its_workflow_stays_on(server):
    status, read = call(server, "GET", "/journal/chart")
    guarded = next(w for w in read["workflows"] if w["guarded"])
    status, one = call(server, "GET", f"/journal/chart/{guarded['id']}")
    lock = next(n for n in one["nodes"] if n["locked"])
    assert one["guarded"] and not one["locked"] and lock["shipped"], "a shipped hold is drawn locked; the workflow holding it is guarded, not locked itself"
    save = lambda nodes, lines: call(server, "POST", f"/journal/chart/{guarded['id']}", {"revision": one["revision"], "nodes": nodes, "lines": lines})
    status, body = save([n for n in one["nodes"] if n["id"] != lock["id"]], [l for l in one["lines"] if lock["id"] not in (l["from"], l["to"])])
    assert status == 409 and f"step {lock['id']} is locked" in body["error"] and "add steps after it" in body["error"], "a locked step cannot be taken out, and the refusal says what a user still can"
    status, body = save([{**n, "text": "my own words"} if n["id"] == lock["id"] else n for n in one["nodes"]], one["lines"])
    assert status == 409 and "its words stay" in body["error"], "a locked step is not reworded"
    trigger = next(n for n in one["nodes"] if n["kind"] == "trigger")
    check = next(e for e in one["catalogue"] if e["kind"] == "check" and not e["takes_text"])
    before = {"id": "new1", "kind": "check", "key": check["key"], "text": "", "x": 0, "y": 0}
    status, body = save(one["nodes"] + [before], one["lines"] + [{"from": trigger["id"], "to": "new1", "port": "then"}, {"from": "new1", "to": lock["id"], "port": "yes"}])
    assert status == 409 and "would come before a locked step" in body["error"], "no check of the user's decides whether the law runs"
    stop = {"id": "new2", "kind": "action", "key": "stop_here", "text": "", "x": 0, "y": 0}
    status, body = save(one["nodes"] + [stop], one["lines"] + [{"from": trigger["id"], "to": "new2", "port": "then"}, {"from": "new2", "to": lock["id"], "port": "then"}])
    assert status == 409, "a Stop the later workflows before a locked step is refused too"
    after = {"id": "new3", "kind": "action", "key": "say", "text": "after the law", "x": 0, "y": 0}
    out = next((l for l in one["lines"] if l["from"] == lock["id"]), None)
    onward = [{"from": "new3", "to": out["to"], "port": "then"}] if out else []
    status, body = save(one["nodes"] + [after], [l for l in one["lines"] if l is not out] + [{"from": lock["id"], "to": "new3", "port": "then"}] + onward)
    assert status == 200 and any(n["key"] == "say" and n["text"] == "after the law" for n in body["nodes"]), f"a step after a locked one is the user's to add: {body}"
    status, body = call(server, "POST", f"/journal/chart/{guarded['id']}/off", {})
    assert status == 409 and "holds locked step" in body["error"], "a workflow holding the law is not turned off"


def test_the_engines_own_moves_are_not_served_with_the_workflows_and_a_run_names_a_state_change(server):
    status, read = call(server, "GET", "/journal/chart")
    assert status == 200 and "fixed" not in read, "the engine's own moves are not workflows and are not shown among them"
    status, made = call(server, "POST", "/journal/chart", {"state": "", "trigger": "tool_finished", "title": "Wait after a tool"})
    trigger = next(n for n in made["nodes"] if n["kind"] == "trigger")
    nodes = made["nodes"] + [{"id": "w", "kind": "action", "key": "wait_outside", "text": "the deploy", "x": 0, "y": 0}]
    status, saved = call(server, "POST", f"/journal/chart/{made['id']}", {"revision": made["revision"], "nodes": nodes, "lines": [{"from": trigger["id"], "to": "w", "port": "then"}]})
    assert status == 200, saved
    hooked = lambda kind, **body: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s9", **body})
    hooked("SessionStart")
    hooked("PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    status, runs = call(server, "GET", "/journal/chart/runs?last=5")
    change = next((r["change"] for r in runs["runs"] if r["change"]), "")
    assert "Idle to Waiting, by step" in change, f"a run names the state change in words: {[r['change'] for r in runs['runs']]}"


def test_the_page_shows_each_nodes_runs_the_answer_given_and_the_count_a_check_read(server):
    status, made = call(server, "POST", "/journal/chart", {"state": "", "trigger": "tool_finished", "title": "Count the tools"})
    trigger = next(n for n in made["nodes"] if n["kind"] == "trigger")
    nodes = made["nodes"] + [
        {"id": "c", "kind": "action", "key": "count_one", "text": "tools", "x": 0, "y": 0},
        {"id": "k", "kind": "check", "key": "count_over", "text": "tools 2", "x": 0, "y": 0},
        {"id": "s", "kind": "action", "key": "say", "text": "two tools now", "x": 0, "y": 0},
    ]
    lines = [{"from": trigger["id"], "to": "c", "port": "then"}, {"from": "c", "to": "k", "port": "then"}, {"from": "k", "to": "s", "port": "yes"}]
    status, saved = call(server, "POST", f"/journal/chart/{made['id']}", {"revision": made["revision"], "nodes": nodes, "lines": lines})
    assert status == 200, saved
    hooked = lambda kind, **body: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s8", **body})
    hooked("SessionStart")
    hooked("PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    hooked("PostToolUse", tool_name="Read", tool_input={}, tool_response="")
    status, drawn = call(server, "GET", f"/journal/chart/{made['id']}")
    runs = {n["key"]: n["runs"] for n in drawn["nodes"]}
    assert runs["count_one"] == 2 and runs["count_over"] == 2 and runs["say"] == 1, "each node says how often it ran"
    assert all(n["last"] > 0 for n in drawn["nodes"] if n["runs"]), "and when last"
    status, recent = call(server, "GET", "/journal/chart/runs?last=5")
    ours = [r for r in recent["runs"] if made["id"] in r["workflows"]]
    check = next(n["id"] for n in drawn["nodes"] if n["key"] == "count_over")
    assert [r["read"][str(check)] for r in ours] == [2, 1], "a run records the count the check read, newest first"
    assert ours[0]["answer"] == "Said: two tools now" and ours[1]["answer"] == "", "the answer the agent was given, in words"
    status, tried = call(server, "POST", "/journal/chart/try", {"trigger": "tool_finished", "environment": "main"})
    assert status == 200 and made["id"] in tried["workflows"] and "Count the tools" in tried["titles"], f"a test run names the workflows it would run, in order: {tried}"
    assert tried["read"][str(check)] == 3 and any("two tools now" in w for w in tried["would"]), "the dry count is read as the live walk would read it, one more than on record"


def test_a_new_workflow_is_titled_by_its_first_action_until_the_user_names_it(server):
    status, made = call(server, "POST", "/journal/chart", {"state": "", "trigger": "tool_finished"})
    assert status == 201 and made["title"] == "New workflow"
    trigger = next(n for n in made["nodes"] if n["kind"] == "trigger")
    nodes = made["nodes"] + [{"id": "s", "kind": "action", "key": "say", "text": "a word", "x": 0, "y": 0}]
    status, saved = call(server, "POST", f"/journal/chart/{made['id']}", {"revision": made["revision"], "nodes": nodes, "lines": [{"from": trigger["id"], "to": "s", "port": "then"}]})
    assert status == 200 and saved["title"] == "Send the agent a message", "the first action names it"
    status, named = call(server, "POST", "/journal/chart", {"state": "", "trigger": "tool_finished", "title": "Mine"})
    assert status == 201 and named["title"] == "Mine", "a title given is kept"


def test_the_journal_knows_whether_a_viewer_tab_is_open(server):
    assert call(server, "GET", "/journal/viewer")[1] == {"open": False}, "no tab has asked anything yet"
    call(server, "GET", "/journal/environments")
    assert call(server, "GET", "/journal/viewer")[1] == {"open": False}, "a call that is not the viewer's, a plugin's program or the shim, opens no tab"
    urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/journal/environments", headers={"X-Journal-Env": "main", "X-Journal-Viewer": "1"}), timeout=5).read()
    assert call(server, "GET", "/journal/viewer")[1] == {"open": True}, "a tab that polls the API is open, and a launch opens no other"


def test_the_secrets_page_makes_fills_allows_deletes_and_restores_a_secret(server, tmp_path, monkeypatch):
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    status, made = call(server, "POST", "/journal/secrets", {"title": "Github", "kind": "api key", "brief": "gh api user", "programs": ["gh"]})
    assert status == 201
    n = made["id"]
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
    send = lambda kind, **extra: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s5", **extra})
    send("SessionStart", source="startup")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "read it", "prompt": "read", "model": "haiku"}, tool_use_id="t1")
    send("PostToolUse", tool_name="Agent", tool_input={}, tool_response={"isAsync": True, "agentId": "a5"}, tool_use_id="t1")
    agent = next(a for a in call(server, "GET", "/journal/agents")[1]["rows"] if a["session"] == "s5")
    page = call(server, "GET", f"/journal/agents/{agent['id']}/transcript")[1]
    assert [(t["kind"], t["text"], t["tools"]) for t in page["turns"]] == [("human", "fix the login", []), ("agent", "Looking.", ["Read"]), ("tool", "", [])], "a tool result is a heading, its text asked for"
    assert call(server, "GET", f"/journal/agents/{agent['id']}/transcript?entry=3")[1]["text"] == "file text"
    assert call(server, "GET", f"/journal/agents/{agent['id']}/transcript?since=1")[1]["turns"][0]["line"] == 2
    sub = call(server, "GET", f"/journal/agents/{agent['id']}/subagents/a5/transcript")[1]
    assert [t["text"] for t in sub["turns"]] == ["Read the login."]
    assert call(server, "GET", f"/journal/agents/{agent['id']}/subagents/..%2Fx/transcript")[0] == 404
    assert call(server, "GET", "/journal/workers/99/transcript")[0] == 404


def test_where_each_agent_stands_in_a_workflow_is_served(server):
    call(server, "POST", "/hooks/claude", {"hook_event_name": "SessionStart", "session_id": "s1", "source": "startup"})
    status, made = call(server, "POST", "/journal/chart", {"state": "", "trigger": "tool_finished", "title": "Counting"})
    trigger = made["nodes"][0]["id"]
    nodes = [*made["nodes"], {"id": "one", "kind": "action", "key": "count_one", "text": "reminders"}, {"id": "enough", "kind": "check", "key": "count_over", "text": "reminders 3"}, {"id": "uses", "kind": "check", "key": "count_over", "text": "uses 5"}, {"id": "say", "kind": "action", "key": "say", "text": "[chart] enough"}]
    lines = [{"from": trigger, "to": "one"}, {"from": "one", "to": "enough"}, {"from": "enough", "to": "uses", "port": "no"}, {"from": "enough", "to": "say", "port": "yes"}, {"from": "uses", "to": "say", "port": "yes"}]
    status, saved = call(server, "POST", f"/journal/chart/{made['id']}", {"revision": made["revision"], "nodes": nodes, "lines": lines})
    assert status == 200, saved
    for path in ("a", "b"):
        call(server, "POST", "/hooks/claude", {"hook_event_name": "PostToolUse", "session_id": "s1", "tool_name": "Read", "tool_input": {"file_path": path}})
    import time
    time.sleep(0.5)
    standing = call(server, "GET", f"/journal/chart/{made['id']}/standing")[1]
    agent = standing["agents"][0]
    assert agent["counts"] == {"reminders": 2} and agent["waits"] is True and agent["port"] == "no", "the agent waits at the last check's No with its count"
    assert "uses" in agent["readings"] and "uses" in standing["readings"] and standing["readings"]["uses"], "a reading a check compares is served with what it counts"
    assert {"number": 3, "setting": ""} in standing["limits"].values() and {"number": 5, "setting": ""} in standing["limits"].values(), "each count check's number is served"


def test_a_kept_version_3_journal_is_offered_put_off_and_brought_across_with_a_report(tmp_path: Path):
    import time
    from journal.repositories.reports import Reports
    from journal.support.scope import Scope
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
        with app.container.get(Scope).of(1):
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


def test_a_share_link_opens_its_document_through_the_share_server_and_nothing_else(sharing):
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    call(server, "POST", "/journal/docs", {"title": "Launch notes", "body": "## Why\nBecause."})
    assert call(server, "GET", "/journal/shares/opens?target=docs:1")[1] == ["Launch notes (docs:1)"]
    assert call(server, "POST", "/journal/shares", {"target": "tasks:1"})[0] == 409, "only a document, a report or a plan is shared"
    status, made = call(server, "POST", "/journal/shares", {"target": "docs:1", "expires": "7d", "comments": False})
    assert status == 201 and made["approved"] and made["target"] == "docs:1" and "password" not in made
    token = made["token"]
    assert re.fullmatch(rf"https://[a-z0-9-]+-[0-9a-f]{{24}}\.tunler\.example/s/{token}", made["link"]), "the link is the journal's own address on the tunler server"
    assert made["opens"] == ["Launch notes (docs:1)"]
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


def share_command(server, *argv: str, session: str = "s1") -> dict:
    """The journal share command as the shim sends it, the agent's when a session is named, else the user's at their terminal."""
    return call(server, "POST", "/cli", {"argv": ["share", *argv], "env": "main", "session": session})[1]


def test_a_link_the_agent_makes_waits_for_the_users_accept_in_the_chat(sharing):
    server, share_server = sharing
    call(server, "POST", "/journal/settings", {"sharing": {"host": "tunler.example"}})
    call(server, "POST", "/journal/docs", {"title": "Launch notes", "body": "## Why\nBecause."})
    assert share_command(server, "opens", "docs:1")["out"].strip() == "Launch notes (docs:1)"
    made = share_command(server, "create", "docs:1", "--comments")
    assert made["code"] == 0 and "waiting for the user's Accept in the chat" in made["out"], made
    token = call(server, "GET", "/journal/shares")[1]["rows"][0]["token"]
    assert visit(share_server, f"/s/{token}/data.json")[0] == 404, "the agent's link opens nothing until the user accepts it"
    card = next(m for m in call(server, "GET", "/journal/messages")[1]["rows"] if m["data"].get("buttons"))
    assert [b["label"] for b in card["data"]["buttons"]] == ["Accept", "Deny"] and "- Launch notes (docs:1)" in card["text"] and "Visitors can leave comments" in card["text"]
    accept = card["data"]["buttons"][0]
    assert call(server, "POST", f"/journal{accept['path']}", {})[1]["approved"], "Accept opens the link through the viewer's own path"
    assert call(server, "POST", f"/journal/messages/{card['id']}/press", {"pressed": ["Accept"]})[1]["data"]["pressed"] == ["Accept"], "the card shows Accept spent"
    assert visit(share_server, f"/s/{token}/data.json")[0] == 200
    assert "docs:1  open" in share_command(server, "list")["out"]
    assert share_command(server, "stop", "1")["code"] == 0 and visit(share_server, f"/s/{token}/data.json")[0] == 410
    assert ", open" in share_command(server, "create", "docs:1", session="")["out"], "a link the user makes at their terminal opens at once"


def comment(share_server, token: str, given: dict, header: str = "1"):
    """A visitor's comment as the share page posts it: the status and the JSON answer."""
    from http.client import HTTPConnection
    connection = HTTPConnection("127.0.0.1", share_server.port, timeout=5)
    connection.request("POST", f"/s/{token}/comment", json.dumps(given), {"Content-Type": "application/json", "X-Shared-Comment": header})
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
    status, made = comment(share_server, token, {"on": "docs:1", "name": "Ana", "text": "The second step is unclear."})
    assert status == 201 and made["data"]["visitor"] == "Ana" and made["data"]["row"] == "docs:1", made
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
    standing = call(server, "GET", "/journal/tunnel")[1]
    assert standing["installed"] is False and standing["problems"] == ["tunler is not installed on this machine, so share links cannot reach this journal."]
    assert standing["server"] == "tunler.jessegall.nl", "with no server set, the one the journal installs from is offered"
    assert call(server, "GET", "/journal/tunnel/domains")[1] == []


def test_a_slow_answer_is_asked_once_given_from_memory_and_asked_again_once_dropped():
    from journal.support.kept_answer import KeptAnswer
    asked = []
    kept = KeptAnswer(lambda: asked.append(1) or len(asked), 60, 0)
    assert (kept.given(), kept.given(), len(asked)) == (1, 1, 1), "the first reader waits for it, the next is given it at once"
    kept.drop()
    assert (kept.given(), len(asked)) == (2, 2), "an answer no longer true is waited for again"


def test_an_output_is_read_by_its_id(tmp_path: Path):
    from journal.support.actor import Actor
    from journal.models.command_output import CommandOutput
    from journal.repositories.command_outputs import CommandOutputs
    from journal.support.scope import Scope
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
        with app.container.get(Scope).of(1):
            kept = app.container.get(CommandOutputs).save(CommandOutput(chain="run", command="make test", folder=str(folder)), Actor.system())
        status, read = call(server, "GET", f"/journal/outputs/{kept.id}")
        assert status == 200 and (read["id"], read["command"], read["outcome"], read["lines"]) == (kept.id, "make test", "failed with code 2", ["one", "two", "oops"])
        assert call(server, "GET", "/journal/outputs/99")[0] == 404
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
    named = set()
    client = (WEB / "api" / "client.js").read_text()
    for method, path, address in OWN.findall(client):
        literal = re.sub(r"\$\{query\(.*?\)\}", "", path or address)
        if not literal.startswith("/${") and "${session" not in literal:
            named.add(("POST" if method == "post" else "GET", re.sub(r"\$\{[^}]*\}", "1", literal)))
    for source in [*WEB.rglob("*.js"), *WEB.rglob("*.vue")]:
        for call_name, table, act in NAMED.findall(source.read_text()):
            if call_name != "act" or act:
                method, shape = SHAPES[call_name]
                named.add((method, shape.format(table=table, act=act)))
    return named


def test_every_route_the_viewer_names_is_served_and_version_threes_api_is_gone(server):
    named = viewer_paths()
    assert len(named) > 100, "the walk reads the viewer's paths, not an empty list"
    unserved = sorted(f"{method} /journal{path}" for method, path in named if not any(route.params(method, f"/journal{path}") is not None for route in server.router.routes))
    assert unserved == [], f"the viewer names routes no controller serves, each of which would answer 404: {unserved}"
    assert not (Path(__file__).resolve().parents[1] / "src" / "journal" / "http" / "v3").exists()
    assert "/api" not in (WEB / "api" / "client.js").read_text()


def test_the_search_page_finds_a_task_by_its_words(server):
    call(server, "POST", "/journal/tasks", {"title": "rebuild the viewer", "brief": "every page"})
    status, found = call(server, "GET", "/journal/search?words=viewer%20page")
    assert status == 200 and found["found"][0]["ref"] == "task 1"
    assert "check" in found["models"] and "message" in found["models"], "the page gets the models it can narrow to"
    status, found = call(server, "GET", "/journal/search?words=viewer%20page&models=plan,message")
    assert found["found"] == [], "narrowed to plans and messages, the task is not found"


def test_the_plan_bars_work_mode_and_the_top_bars_pause_are_version_fours_own(server):
    assert call(server, "GET", "/journal/mode")[1] == {"mode": "builder", "modes": ["builder", "orchestrator", "solo"]}
    assert call(server, "POST", "/journal/mode", {"mode": "orchestrator"})[1]["mode"] == "orchestrator"
    assert call(server, "GET", "/journal/settings")[1]["workers"]["mode"] == "orchestrator"
    assert call(server, "POST", "/journal/mode", {"mode": "boss"})[0] == 409
    hooked = lambda kind, **body: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s7", **body})
    hooked("SessionStart")
    agent = call(server, "GET", "/journal/agents")[1]["rows"][0]
    paused = call(server, "POST", f"/journal/agents/{agent['id']}/pause")[1]
    assert paused["state"] == "paused" and paused["doing"] == "you to resume it"
    assert "the user paused you" in json.dumps(hooked("PreToolUse", tool_name="Read", tool_input={"file_path": "a"})[1])
    assert call(server, "POST", f"/journal/agents/{agent['id']}/resume")[1]["state"] == agent["state"]
    assert "the user paused you" not in json.dumps(hooked("PreToolUse", tool_name="Read", tool_input={"file_path": "a"})[1])
    assert call(server, "POST", f"/journal/agents/{agent['id']}/resume")[0] == 409, "an agent not paused is not resumed"


def test_the_about_page_reads_the_installed_version_and_the_changelog_a_page_of_releases_at_a_time(server, monkeypatch):
    from journal.features.updates.support import changelog
    from journal.version import VERSION
    monkeypatch.setattr(changelog, "RELEASES_PER_PAGE", 2)
    status, about = call(server, "GET", "/journal/updates")
    assert status == 200 and about["installed"] == VERSION and about["changelog"].startswith("# Changelog") and about["changelog"].count("\n## ") == 2 and about["more"], "the heading and the newest releases first"
    status, older = call(server, "GET", f"/journal/updates/changelog?skip={about['shown']}")
    assert status == 200 and older["changelog"].startswith("## ") and older["shown"] == about["shown"] + 2, "then older releases, a page at a time"


def test_a_plans_timeline_has_each_start_log_and_done_of_its_tasks_oldest_first(server):
    call(server, "POST", "/journal/plans", {"title": "the phone"})
    call(server, "POST", "/journal/plans/1/tasks", {"title": "pair it"})
    status, moments = call(server, "GET", "/journal/plans/1/timeline")
    assert status == 200 and moments == [], "nothing has happened on its tasks yet"
