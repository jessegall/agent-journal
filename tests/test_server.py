"""Phase three: the server answers real HTTP on a free port; tasks are created, read, started and finished over it."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config
from journal.console.where import Where


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
    status, done = call(server, "POST", "/journal/tasks/1/finish", {"how": "merged"})
    assert done["state"] == "done" and done["outcome"] == "merged"
    status, listed = call(server, "GET", "/journal/tasks")
    assert [t["title"] for t in listed] == ["ship it"]
    for n in range(3):
        call(server, "POST", "/journal/tasks", {"title": f"more {n}"})
    page = call(server, "GET", "/journal/tasks?limit=2")[1]
    assert [t["title"] for t in page] == ["more 2", "more 1"], "newest first, capped"
    assert [t["title"] for t in call(server, "GET", f"/journal/tasks?limit=2&before={page[-1]['id']}")[1]] == ["more 0", "ship it"]
    assert call(server, "GET", "/journal/tasks", env="other")[0] == 404, "an environment nobody made is not found, never made by a read"
    call(server, "POST", "/journal/environments", {"name": "other"})
    assert call(server, "GET", "/journal/tasks", env="other")[1] == []


def test_a_missing_row_and_a_missing_route_say_so(server):
    assert call(server, "GET", "/journal/tasks/9")[0] == 404
    assert call(server, "GET", "/journal/nothing")[0] == 404


def test_the_port_file_is_written_while_serving(server):
    assert int(server.config.port_file.read_text()) == server.port


def test_version_fours_own_api_lists_every_resource_and_answers_a_question(server):
    assert call(server, "GET", "/journal/environments")[1][0]["name"] == "main"
    for name in ("plans", "facts", "reminders", "reports", "docs", "workers", "messages", "questions", "agents", "rules", "entries"):
        assert call(server, "GET", f"/journal/{name}")[0] == 200, name
    status, message = call(server, "POST", "/journal/messages", {"text": "hello agent"})
    assert status == 201 and message["author"] == "user" and message["read_at"] is None
    status, question = call(server, "POST", "/journal/questions", {"text": "which?", "options": ["a", "b"]})
    assert status == 201
    status, answered = call(server, "POST", "/journal/questions/1/answer", {"answer": "b"})
    assert answered["answer"] == "b"
    status, since = call(server, "GET", "/journal/entries/since?since=0")
    assert status == 200 and "latest" in since
    status, settings = call(server, "GET", "/journal/settings")
    assert any(f["name"] == "tasks" and f["on"] for f in settings)
    call(server, "POST", "/journal/settings", {"key": "features.tasks", "value": False})
    assert not next(f for f in call(server, "GET", "/journal/settings")[1] if f["name"] == "tasks")["on"]


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
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        status, message = call(server, "POST", "/api/message", {"brief": "hello", "idempotency": "k1"})
        assert status in (200, 201)
        n = message.get("n") or message.get("row", {}).get("n") or 1
        call(server, "POST", f"/api/message/{n}/react", {"face": "👍"})
        listed = json.dumps(call(server, "GET", "/api/reaction")[1], ensure_ascii=False)
        assert '"face": "👍"' in listed and f'"message:{n}"' in listed
        call(server, "POST", f"/api/message/{n}/react", {"face": "👍"})
        assert "\"face\"" not in json.dumps(call(server, "GET", "/api/reaction")[1], ensure_ascii=False), "the same face again takes it off"
        hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
        for kind, extra in (("SessionStart", {}), ("PreToolUse", {"tool_name": "Agent", "tool_input": {"description": "review the login", "prompt": "read the login flow and report", "subagent_type": "reviewer", "model": "sonnet"}}), ("PostToolUse", {"tool_name": "Agent", "tool_input": {}, "tool_response": "fine"})):
            urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s9", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        agents = json.dumps(call(server, "GET", "/api/agent")[1])
        assert '"task": "review the login"' in agents and '"type": "reviewer"' in agents and '"status": "done"' in agents
    finally:
        app.runtime().stop()


def test_a_refused_subagent_is_not_shown_and_one_never_answered_ends_with_its_turn_or_session(server):
    send = lambda kind, **extra: call(server, "POST", "/hooks/claude", {"hook_event_name": kind, "session_id": "s7", **extra})
    rows = lambda: next(a for a in call(server, "GET", "/api/agent")[1]["rows"] if a["title"] == "s7")["data"]["subagent_rows"]
    send("SessionStart", source="startup")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "no model named", "prompt": "read"}, tool_use_id="t-refused")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "cut off", "prompt": "read", "model": "haiku"}, tool_use_id="t-cut")
    send("PreToolUse", tool_name="Agent", tool_input={"description": "in the background", "prompt": "read", "model": "haiku"}, tool_use_id="t-bg")
    send("PostToolUse", tool_name="Agent", tool_input={}, tool_response={"isAsync": True, "agentId": "a7"}, tool_use_id="t-bg")
    assert [r["task"] for r in rows()] == ["cut off", "in the background"], "a dispatch the journal refused never ran"
    send("Stop")
    assert [(r["running"], r["status"]) for r in rows()] == [(False, "stopped"), (True, "running")], "a call with no answer ends with its turn; one in the background goes on"
    send("SessionStart", source="compact")
    assert rows()[1]["running"] is True, "a compaction ends no subagent"
    send("SessionEnd")
    assert [r["running"] for r in rows()] == [False, False], "a subagent with no stop ends with its session"


def test_request_threads_leave_no_connection_behind(server):
    from journal.db.connection import Connection
    database = server.database
    for _ in range(40):
        call(server, "GET", "/api/todo")
    assert len(database._open) <= 3, f"{len(database._open)} connections open after 40 requests: threads must return theirs to the pool"


def test_each_type_is_read_alone_above_the_last_number_seen(server):
    """A type's read answers its rows above `from`, the newest `last` of them, with its counts; a type whose rows will not load fails alone and the others still answer."""
    for n in range(1, 5):
        call(server, "POST", "/journal/tasks", {"title": f"task {n}"})
        call(server, "POST", f"/journal/tasks/{n}/start")
        call(server, "POST", f"/journal/tasks/{n}/finish", {"how": "done"})
    for n in range(3):
        call(server, "POST", "/api/message", {"brief": f"hello {n}", "idempotency": f"k{n}"})
    todos = call(server, "GET", "/api/todo?from=1&last=2&completed=1")[1]
    assert [r["n"] for r in todos["rows"]] == [3, 4] and todos["more"] is True
    assert todos["counts"] == {"all": 4, "open": 0, "unread": 0}
    messages = call(server, "GET", "/api/message?from=1&last=5")[1]
    assert [r["n"] for r in messages["rows"]] == [2, 3] and messages["counts"]["all"] == 3
    assert call(server, "GET", "/api/message?from=3&last=5")[1]["rows"] == [], "a poll from the last number seen carries nothing when nothing is new"
    call(server, "POST", "/journal/facts", {"text": "the sky is blue"})
    with server.database.transaction():
        server.database.execute("UPDATE facts SET keywords = '{broken' WHERE id = 1")
    status, body = call(server, "GET", "/api/fact")
    assert status == 500 and "error" in body, "a type whose rows will not load fails alone, with the fault named"
    assert call(server, "GET", "/api/todo?from=3&completed=1")[1]["rows"][0]["n"] == 4, "a fact that will not load leaves the tasks answering"
    assert call(server, "GET", "/api/dashboard")[0] == 404, "the one call for every type is gone"


def test_the_environment_header_scopes_each_read_and_a_request_without_it_is_refused(server):
    call(server, "POST", "/journal/environments", {"name": "other"})
    call(server, "POST", "/api/todo", {"title": "main's own"})
    call(server, "POST", "/api/todo", {"title": "other's own"}, env="other")
    assert [r["title"] for r in call(server, "GET", "/api/todo")[1]["rows"]] == ["main's own"]
    assert [r["title"] for r in call(server, "GET", "/api/todo", env="other")[1]["rows"]] == ["other's own"]
    with pytest.raises(HTTPError) as refused:
        urlopen(f"http://127.0.0.1:{server.port}/api/todo", timeout=5)
    assert refused.value.code == 409 and "X-Journal-Env" in json.loads(refused.value.read())["error"]


def test_the_viewers_pages_read_the_shapes_they_expect(tmp_path: Path):
    """Settings answer with the whole tree, a read message is read and not closed, a running plan is active, a check carries its last run, a sequence its steps, the hub its counts, the Code page its files."""
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        status, tree = call(server, "POST", "/api/settings", {"features": {"thinking": False}})
        assert status == 200 and tree["features"]["thinking"] is False and len(tree["features"]) > 10
        n = call(server, "POST", "/api/message", {"brief": "hello", "idempotency": "k1"})[1]["n"]
        call(server, "POST", f"/api/message/{n}/read", {})
        row = call(server, "GET", f"/api/message/{n}")[1]
        assert row["seen"] == ["user", "agent"] and row["completed"] == 0 and row["data"]["delivered"] is True, "read, delivered, not closed"
        call(server, "POST", f"/api/message/{n}/react", {"face": "👍"})
        app.console().run(["message", "react", str(n), "🎉"], Where("main", "s1"))
        assert call(server, "GET", f"/api/message/{n}")[1]["completed"] > 0, "a face from the agent answers it"
        app.console().run(["plan", "create", "p"], Where("main"))
        app.console().run(["plan", "approve", "1"], Where("main"))
        app.console().run(["plan", "start", "1"], Where("main", "s1"))
        assert call(server, "GET", "/api/plan/1")[1]["data"]["status"] == "active"
        app.console().run(["check", "create", "truthy", "--command", "true"], Where("main"))
        app.console().run(["check", "run", "1"], Where("main"))
        check = call(server, "GET", "/api/check/1")[1]
        assert check["data"]["last"]["ok"] is True and "runs" in check["data"]
        release = app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Where("main")).out.split()[1].rstrip(":")
        assert [s["title"] for s in call(server, "GET", f"/api/sequence/{release}")[1]["sections"]] == ["tag", "push"]
        counts = call(server, "GET", "/api/summary")[1]["environments"][0]["counts"]
        assert {"messages", "suggestions", "todos", "questions"} <= set(counts)
        (tmp_path / "hello.py").write_text("print('hi')\n")
        assert call(server, "GET", "/api/file?path=hello.py")[1]["lines"] == 1
        assert "diff" in call(server, "GET", "/api/diff?path=hello.py")[1]
        assert call(server, "GET", "/api/project-files/find?q=hello")[1][0]["name"] == "hello.py"
        assert call(server, "POST", "/api/agent/s1/pause", {})[0] == 409, "an act by session is refused, not a server error"
        listed = call(server, "GET", f"/api/message?n={n}")[1]["rows"]
        assert [r["n"] for r in listed] == [n]
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
        assert call(server, "GET", "/api/plan/1")[1]["data"]["current"] == 1
        console.run(["task", "done", "1"], agent)
        assert call(server, "GET", "/api/plan/1")[1]["data"]["current"] == 1, "a phase with a task still open is the one shown"
        console.run(["task", "done", "2"], agent)
        assert call(server, "GET", "/api/plan/1")[1]["data"]["current"] == 2, "every task of phase one done: phase two is shown"
        console.run(["task", "done", "3"], agent)
        assert call(server, "GET", "/api/plan/1")[1]["data"]["current"] == 2, "all done: the last phase"
    finally:
        app.runtime().stop()


def test_the_status_line_knows_what_the_agent_waits_for(tmp_path: Path):
    from journal.models.actor import Actor
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
        work = call(server, "GET", "/api/work")[1]["rows"][0]
        assert work["title"] == "the footer" and work["data"]["awaiting"] == "" and work["data"]["todo"] == 1
        app.console().run(["stuck", "stuck on the login"], Where("main", "s1"))
        work = call(server, "GET", "/api/work")[1]["rows"][0]
        assert work["data"]["awaiting"] == "stuck on the login" and work["data"]["awaiting_since"] > 0
        assert call(server, "GET", "/api/summary")[1]["environments"][0]["work"]["awaiting"] == "stuck on the login"
    finally:
        app.runtime().stop()


def test_the_activity_rail_the_edits_pane_and_the_documents_read_true(tmp_path: Path, monkeypatch):
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
    def hook(kind, **extra):
        return urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
    try:
        hook("SessionStart")
        n = call(server, "POST", "/api/message", {"brief": "hello", "idempotency": "k"})[1]["n"]
        app.console().run(["message", "read", str(n)], Where("main", "s1"))
        app.console().run(["task", "create", "t", "--start"], Where("main", "s1"))
        app.console().run(["task", "done", "1", "--how", "shipped"], Where("main", "s1"))
        events = call(server, "GET", "/api/events?last=50")[1]
        assert any(e["type"] == "message" and e["action"] == "updated" and e["data"]["by"] == "read" for e in events)
        assert any(e["type"] == "todo" and e["action"] == "completed" for e in events)
        assert any(e["type"] == "agent" and e["data"]["hook"] == "SessionStart" for e in events)
        hook("PostToolUse", tool_name="Edit", tool_input={"file_path": str(tmp_path / "a.py"), "old_string": "x", "new_string": "y"}, tool_response={"structuredPatch": [{"oldStart": 7, "newStart": 7, "lines": [" before", "-x", "+y", " after"]}]})
        edit = call(server, "GET", "/api/agent/1/edits")[1]["edits"][0]
        assert [r["kind"] for r in edit["rows"]] == ["ctx", "del", "add", "ctx"] and edit["first_line"] == 7 and edit["last_line"] == 9
        call(server, "POST", "/cli", {"argv": ["shell", "ran", "journal task list", "--chain", "c1", "--status", "0", "--output", "1 t"], "env": "main", "session": "s1", "agent": True})
        assert call(server, "GET", "/api/agent/1/terminal")[1]["lines"][-1]["tool"] == "Journal"
        assert call(server, "POST", "/api/agent/s1/shell", {"command": "ls"})[1]["queued"] is True and typed[-1] == "ls"
        doc = call(server, "POST", "/api/doc", {"title": "Design", "brief": "Intro\n\n## Goals\n\nShip it"})[1]
        assert [s["title"] for s in doc["sections"]] == ["Goals"]
        doc = call(server, "POST", f"/api/doc/{doc['n']}/section", {"title": "Risks", "body": "None"})[1]
        assert [s["title"] for s in doc["sections"]] == ["Goals", "Risks"]
        assert call(server, "POST", f"/api/doc/{doc['n']}/update", {"title": "Design v2", "brief": doc["brief"]})[1]["title"] == "Design v2"
        app.console().run(["task", "create", "later", "--start"], Where("main", "s1"))
        app.console().run(["task", "park", "2", "waiting"], Where("main", "s1"))
        assert call(server, "GET", "/api/todo/2")[1]["data"]["status"] == "parked"
    finally:
        app.runtime().stop()


def test_the_remaining_pages_act_through_the_viewer(tmp_path: Path):
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        app.console().run(["plan", "create", "p"], Where("main"))
        assert call(server, "POST", "/api/plan/1/finish", {})[1]["data"]["status"] == "done"
        app.console().run(["check", "create", "truthy", "--command", "true"], Where("main"))
        assert call(server, "POST", "/api/check/1/run", {})[1]["data"]["last"]["ok"] is True
        assert call(server, "POST", "/api/check/1/set", {"key": "every", "value": "5"})[1]["data"]["every"] == 5
        release = app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Where("main")).out.split()[1].rstrip(":")
        assert [s["title"] for s in call(server, "POST", f"/api/sequence/{release}/steps", {"steps": [{"title": "tag"}, {"title": "test"}, {"title": "push"}]})[1]["sections"]] == ["tag", "test", "push"]
        app.console().run(["trigger", "create", "deploy", "say so"], Where("main"))
        updated = call(server, "POST", "/api/trigger/1/update", {"words": "deploy, release", "does": "deny", "text": "wait"})[1]
        assert updated["data"]["words"] == ["deploy", "release"] and updated["data"]["action"] == "deny"
        skills = call(server, "GET", "/api/skills?agent=1")[1]
        assert any(s["name"] == "journal" for s in skills) and "text" in call(server, "GET", "/api/skills/journal")[1]
        call(server, "POST", "/api/environment", {"title": "spike"})
        n = next(r["n"] for r in call(server, "GET", "/api/environment")[1]["rows"] if r["title"] == "spike")
        assert call(server, "POST", f"/api/environment/{n}/remove", {})[0] == 200
        assert all(r["title"] != "spike" for r in call(server, "GET", "/api/environment")[1]["rows"])
        assert call(server, "GET", "/api/summary")[1]["environments"][0]["silent"] is False
    finally:
        app.runtime().stop()


def test_a_file_attached_to_a_message_is_stored_and_served(server):
    n = call(server, "POST", "/api/message", {"brief": "see the picture", "idempotency": "f1"})[1]["n"]
    boundary = "b0undary"
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"note.txt\"\r\nContent-Type: text/plain\r\n\r\nhello there\r\n--{boundary}--\r\n").encode()
    request = HttpRequest(f"http://127.0.0.1:{server.port}/api/message/{n}/upload", data=body, method="POST", headers={"Content-Type": f"multipart/form-data; boundary={boundary}", "X-Journal-Env": "main"})
    with urlopen(request, timeout=5) as reply:
        row = json.loads(reply.read())
    assert row["data"]["files"] == {"note.txt": ""}
    with urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/api/message/{n}/files/note.txt?env=main", headers={"X-Journal-Env": "main"}), timeout=5) as reply:
        assert reply.read() == b"hello there" and reply.headers["Content-Type"].startswith("text/plain")


def test_a_viewer_polling_from_an_id_ahead_of_a_reset_record_is_brought_back_in_step(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        call(server, "POST", "/api/message", {"brief": "after the reset", "idempotency": "r1"})
        events = call(server, "GET", "/api/events?since=999999")[1]
        assert events and events[-1]["type"] == "message", "an id from a journal that was reset still gets the recent events"
    finally:
        app.runtime().stop()


def test_the_agent_bars_pickers_type_the_providers_command_and_a_reply_names_what_it_answers(tmp_path: Path, monkeypatch):
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    from journal.supervisor_link import SupervisorLink
    typed = []
    monkeypatch.setattr(SupervisorLink, "_send", lambda self, environment_id, instruction: typed.append(instruction["line"]))
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        controls = call(server, "GET", "/api/agent-controls/claude?model=opus&effort=high")[1]
        assert [g["key"] for g in controls["groups"]] == ["model", "effort", "context"] and controls["groups"][0]["current"] == "opus"
        assert call(server, "POST", "/api/agent/s1/control", {"action": "effort", "value": "max"})[1]["queued"] is True and typed[-1] == "/effort max"
        assert call(server, "POST", "/api/agent/s1/control", {"action": "model", "value": "gpt"})[0] == 409
        n = call(server, "POST", "/api/message", {"brief": "is the footer fixed?\nand the header?", "idempotency": "q"})[1]["n"]
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": "SessionStart", "session_id": "s1"}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": "MessageDisplay", "session_id": "s1", "message": f"[!reply:{n}]\nBoth are."}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        reply = call(server, "GET", "/api/message")[1]["rows"][-1]
        assert reply["brief"] == "Both are." and reply["refs"] == [f"message:{n}"] and reply["data"]["reply_to"] == n
    finally:
        app.runtime().stop()


def test_a_users_message_and_the_agents_reply_to_it_are_two_message_rows(tmp_path: Path):
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        n = call(server, "POST", "/api/message", {"brief": "hello", "idempotency": "c1"})[1]["n"]
        for kind, extra in (("SessionStart", {}), ("MessageDisplay", {"message": f"[!reply:{n}]\nHello back."})):
            urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        rows = [r for r in call(server, "GET", "/api/message?completed=1")[1]["rows"] if n in (r["n"], r["data"]["reply_to"])]
        assert [(r["type"], r["data"]["author"], r["data"]["reply_to"], r["brief"]) for r in rows] == [("message", "user", 0, "hello"), ("message", "agent", n, "Hello back.")]
        assert rows[0]["data"]["actor"].startswith("user") and rows[1]["data"]["actor"] == "agent:s1" and rows[1]["data"]["acknowledgement"] is False
        assert call(server, "GET", "/api/comment")[1]["rows"] == [], "a reply is no comment"
        kinds = [(e["type"], e["action"]) for e in call(server, "GET", "/api/events?since=0")[1]]
        assert ("message", "created") in kinds and "comment" not in {kind for kind, _ in kinds}
    finally:
        app.runtime().stop()


def test_the_message_stream_holds_the_users_words_the_agents_and_the_systems_cards_by_number(tmp_path: Path):
    from journal.engine.cards import Cards
    from journal.models.actor import Actor
    from journal.models.setting import Setting
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.container.get(Settings).save(Setting(environment_id=0, key="features.skills", value=False), Actor.system())
    app.runtime().start()
    server = app.server()
    try:
        n = call(server, "POST", "/api/message", {"brief": "hello", "idempotency": "c1"})[1]["n"]
        for kind, extra in (("SessionStart", {}), ("MessageDisplay", {"message": f"[!reply:{n}]\nHello back."})):
            urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=json.dumps({"hook_event_name": kind, "session_id": "s1", **extra}).encode(), method="POST", headers={"Content-Type": "application/json", "X-Journal-Env": "main"}), timeout=5).read()
        app.runtime().deferred.drain()
        app.container.get(Cards).show(1, "s1", "Check lint passed", "check", "good", "all clean", "check:3")
        rows = [r for r in call(server, "GET", "/api/message?completed=1")[1]["rows"] if r["n"] >= n]
        assert [r["n"] for r in rows] == sorted(r["n"] for r in rows)
        assert [(r["data"]["author"], r["brief"]) for r in rows] == [("user", "hello"), ("agent", "Hello back."), ("system", "Check lint passed")]
        card = rows[-1]
        assert card["seen"] == ["system"] and card["completed"] and card["data"]["actor"] == "system"
        assert card["data"]["card"] == {"kind": "card", "session": "s1", "icon": "check", "tone": "good", "detail": "all clean", "row": "check:3"}
    finally:
        app.runtime().stop()


def test_the_board_is_off_and_stays_off(server):
    assert "kanban" not in call(server, "GET", "/api/settings")[1]["features"]
    assert "kanban" not in call(server, "POST", "/api/settings", {"features": {"kanban": True}})[1]["features"], "a switch of a feature version 4 does not have is not kept"


def test_a_comment_written_under_a_task_in_the_viewer_is_the_users_message_linked_to_it(server):
    from journal.console.where import Where
    call(server, "POST", "/api/todo", {"title": "the footer", "idempotency": "t1"})
    status, made = call(server, "POST", "/api/todo/1/comment", {"text": "please also check the header"})
    assert status == 200 and made["refs"] == ["todo:1"] and made["brief"] == "please also check the header"
    rows = call(server, "GET", "/api/comment")[1]["rows"]
    assert [(r["refs"], r["seen"]) for r in rows] == [(["todo:1"], ["user"])]
    messages = call(server, "GET", "/api/message")[1]["rows"]
    assert messages[-1]["brief"] == "please also check the header" and messages[-1]["seen"] == ["user"]


def test_the_manifest_names_the_workflow_node_that_reads_each_setting_and_says_when_none_does(server):
    manifest = call(server, "GET", "/api/manifest")[1]
    hold_after = next(s for s in manifest["features"]["messages"]["settings"] if s["name"] == "hold_after")
    assert hold_after["read_by"] and {r["workflow"] for r in hold_after["read_by"]} == {"Hold writes while something is owed, and over unread or unanswered messages"} and all(r["node"] > 0 for r in hold_after["read_by"]), "the guards' workflow has the check that reads the hold cadence"
    auto = next(s for s in manifest["features"]["tasks"]["settings"] if s["name"] == "auto")
    assert auto["read_by"] == [], "the auto switch is read by the auto_mode check, which names no setting in its text"


def test_the_settings_page_offers_only_what_the_code_reads_and_a_change_reaches_it(tmp_path: Path):
    from journal.features.tasks.feature import Tasks
    from journal.repositories.settings import Settings
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        manifest = call(server, "GET", "/api/manifest")[1]
        tasks = manifest["features"]["tasks"]
        assert [s["name"] for s in tasks["settings"]] == ["auto", "first_nudge_after", "name_every", "log_after"], "a feature's options, in its words"
        assert all(f in manifest["features"] for f in ("messages", "shell", "voices")) and "kanban" not in manifest["features"], "version 3's leftovers are gone"
        assert {g["key"] for g in manifest["groups"]} == set(manifest["features"]), "one group per feature"
        status, tree = call(server, "POST", "/api/settings", {"tasks": {"log_after": 60}})
        assert status == 200 and tree["tasks"]["log_after"] == 60 and app.container.get(Settings).option(Tasks.LOG_AFTER) == 60, "saved where the code reads it"
        tree = call(server, "POST", "/api/settings", {"tasks": {}})[1]
        assert "tasks" not in tree and app.container.get(Settings).option(Tasks.LOG_AFTER) == 50, "dropped from the page, back to its default"
    finally:
        app.runtime().stop()


def test_a_read_of_an_unknown_environment_is_not_found_and_makes_none(tmp_path: Path):
    from journal.repositories.environments import Environments
    app = App(Config(tmp_path, port=0))
    app.runtime().start()
    server = app.server()
    try:
        assert call(server, "GET", "/api/settings/settings")[0] == 404
        assert not app.container.get(Environments).where(name="settings"), "a stray address in the browser never makes an environment"
    finally:
        app.runtime().stop()


def test_a_chat_lists_its_last_fifty_messages_and_the_rest_on_scrolling_up():
    from journal.http.v3.listing import Listing
    from journal.http.v3.v3_row import V3Row
    rows = [V3Row(type="message", n=n, title=f"m{n}", brief=f"m{n}", seen=["user"], created=float(n), updated=float(n), completed=0.0) for n in range(1, 61)]
    chat = Listing.from_query({"completed": "1"})
    assert [r["n"] for r in chat.listed(rows)["rows"]] == list(range(1, 61)), "a work list shows every open row, however many"
    from dataclasses import replace
    timeline = replace(chat, timeline=True)
    page = timeline.listed(rows)
    assert [r["n"] for r in page["rows"]] == list(range(11, 61)) and page["more"], "a chat pages strictly: the last fifty, the rest on scrolling up"
    older = replace(Listing.from_query({"completed": "1", "before": "11"}), timeline=True).listed(rows)
    assert [r["n"] for r in older["rows"]] == list(range(1, 11)) and not older["more"]


def test_a_hold_a_trigger_reaches_through_no_check_is_refused_and_a_wait_with_no_release_is_flagged(server):
    status, read = call(server, "GET", "/journal/chart")
    awaiting = next(w for w in read["workflows"] if w["state"] == "awaiting" and w["event"] == "workers.updated")
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
    assert read["states"][0]["key"] == "idle" and set(states) == {"idle", "working", "following_plan", "awaiting", "waiting", "expecting", "stuck", "running_sequence", "ended"}, "the nine states the engine has, the first first; the pauses the agent owed are facts now"
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
    assert titles["task_logs.created"] == "A task log is created" and titles["mcp_servers.updated"] == "An MCP server is updated" and titles["edits.deleted"] == "An edit is deleted" and titles["nodes.created"] == "A workflow step is created"
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
    assert status >= 400 and "the trigger is idle, but this workflow is for idle at tool_finished" in json.dumps(body)




def test_the_profiles_page_lists_the_agents_folder_and_saves_a_profile_as_claude_reads_it(server, journal_root):
    status, read = call(server, "GET", "/journal/profiles")
    assert status == 200 and read == {"profiles": []}, "a fresh journal has no agents folder yet"
    status, saved = call(server, "POST", "/journal/profiles/critic", {"description": "Reads a design through one lens.", "tools": "Read, Grep", "model": "sonnet", "body": "You are a critic.\n\nSay what is wrong."})
    assert status == 200 and saved["name"] == "critic" and saved["shipped"] is False and saved["path"] == ".claude/agents/critic.md"
    assert (journal_root / ".claude/agents/critic.md").read_text() == "---\nname: critic\ndescription: Reads a design through one lens.\ntools: Read, Grep\nmodel: sonnet\n---\n\nYou are a critic.\n\nSay what is wrong.\n"
    status, read = call(server, "GET", "/journal/profiles")
    assert [p["name"] for p in read["profiles"]] == ["critic"] and read["profiles"][0]["uses"] == 0 and read["profiles"][0]["body"] == "You are a critic.\n\nSay what is wrong."
    status, one = call(server, "GET", "/journal/profiles/critic")
    assert status == 200 and one["model"] == "sonnet" and one["tools"] == "Read, Grep"
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
    assert status == 409, "a Stop here before a locked step is refused too"
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
    assert "Idle to Expecting something outside, by step" in change, f"a run names the state change in words: {[r['change'] for r in runs['runs']]}"


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
