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
    assert hold_after["read_by"] and {r["workflow"] for r in hold_after["read_by"]} >= {"Idle", "Working"} and all(r["node"] > 0 for r in hold_after["read_by"]), "every state's workflow has the check that reads the hold cadence"
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
    awaiting = next(w for w in read["workflows"] if w["state"] == "awaiting")
    assert status == 200 and awaiting["warnings"] == [], "the shipped wait releases the agent"
    nodes = [{"id": "t", "kind": "trigger", "key": "tool_starting"}, {"id": "h", "kind": "action", "key": "hold", "text": "wait"}]
    status, body = call(server, "POST", f"/journal/chart/{awaiting['id']}", {"revision": awaiting["revision"], "nodes": nodes, "lines": [{"from": "t", "to": "h"}]})
    assert status == 409 and "action h holds the agent at every tool_starting: put a check before it" in body["error"]
    nodes = [{"id": "t", "kind": "trigger", "key": "tool_starting"}, {"id": "s", "kind": "action", "key": "say", "text": "still waiting"}]
    status, saved = call(server, "POST", f"/journal/chart/{awaiting['id']}", {"revision": awaiting["revision"], "nodes": nodes, "lines": [{"from": "t", "to": "s"}]})
    assert status == 200 and saved["warnings"] == ["nothing in this workflow releases the agent: without a release or a move, an agent awaiting stays so until you release it by hand"]



def test_a_shipped_workflow_cannot_be_deleted_and_an_emptied_one_reads_off(server):
    status, read = call(server, "GET", "/journal/chart")
    base = next(w for w in read["workflows"] if w["state"] == "idle")
    assert status == 200 and not base["off"], "a shipped workflow with its drawing answers its events"
    status, body = call(server, "POST", f"/journal/chart/{base['id']}/remove", {})
    assert status == 409 and "empty it or reset it" in body["error"], "a shipped workflow stays"
    status, saved = call(server, "POST", f"/journal/chart/{base['id']}", {"revision": base["revision"], "nodes": [], "lines": []})
    assert status == 200 and saved["nodes"] == []
    status, read = call(server, "GET", "/journal/chart")
    assert next(w for w in read["workflows"] if w["id"] == base["id"])["off"], "an emptied workflow answers nothing and reads off"


def test_the_page_refuses_a_second_workflow_of_the_older_shape_on_an_event_and_a_second_on_a_state(server):
    status, first = call(server, "POST", "/journal/chart", {"trigger": "idle", "title": "Another stop"})
    assert status == 201, "a workflow of the older shape on an event no other such workflow answers"
    status, body = call(server, "POST", "/journal/chart", {"trigger": "idle", "title": "Yet another stop"})
    assert status >= 400 and "one workflow per event" in json.dumps(body)
    status, body = call(server, "POST", "/journal/chart", {"state": "working", "title": "Working twice"})
    assert status >= 400 and "one workflow per state" in json.dumps(body)
    status, made = call(server, "POST", "/journal/chart", {"trigger": "tool_finished", "title": "After a tool"})
    assert status == 201
    moved = [{**node, "key": "idle"} for node in made["nodes"]]
    status, body = call(server, "POST", f"/journal/chart/{made['id']}", {"revision": made["revision"], "nodes": moved, "lines": []})
    assert status >= 400 and "one workflow per event" in json.dumps(body)
    status, listed = call(server, "GET", "/journal/chart")
    assert [w["sidelined_by"] for w in listed["workflows"]] == [None] * 8, "each answers its own event or its own state"

