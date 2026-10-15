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
def server(tmp_path: Path):
    app = App(Config(tmp_path, port=0))
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
    status, task = call(server, "POST", "/api/tasks", {"title": "ship it", "brief": "b"})
    assert status == 201 and task["id"] == 1 and task["created_by"] == "user:1"
    status, started = call(server, "POST", "/api/tasks/1/start")
    assert status == 200 and started["state"] == "started"
    assert call(server, "POST", "/api/tasks/1/log", {"line": "halfway"})[0] == 201
    status, done = call(server, "POST", "/api/tasks/1/finish", {"how": "merged"})
    assert done["state"] == "done" and done["outcome"] == "merged"
    status, listed = call(server, "GET", "/api/tasks")
    assert [t["title"] for t in listed] == ["ship it"]
    for n in range(3):
        call(server, "POST", "/api/tasks", {"title": f"more {n}"})
    page = call(server, "GET", "/api/tasks?limit=2")[1]
    assert [t["title"] for t in page] == ["more 2", "more 1"], "newest first, capped"
    assert [t["title"] for t in call(server, "GET", f"/api/tasks?limit=2&before={page[-1]['id']}")[1]] == ["more 0", "ship it"]
    assert call(server, "GET", "/api/tasks", env="other")[1] == []


def test_a_missing_row_and_a_missing_route_say_so(server):
    assert call(server, "GET", "/api/tasks/9")[0] == 404
    assert call(server, "GET", "/api/nothing")[0] == 404


def test_the_port_file_is_written_while_serving(server):
    assert int(server.config.port_file.read_text()) == server.port


def test_the_viewer_api_lists_every_resource_and_answers_a_question(server):
    assert call(server, "GET", "/api/environments")[1][0]["name"] == "main"
    for name in ("plans", "facts", "reminders", "reports", "docs", "workers", "messages", "questions", "agents", "rules", "entries"):
        assert call(server, "GET", f"/api/{name}")[0] == 200, name
    status, message = call(server, "POST", "/api/messages", {"text": "hello agent"})
    assert status == 201 and message["author"] == "user" and message["read_at"] is None
    status, question = call(server, "POST", "/api/questions", {"text": "which?", "options": ["a", "b"]})
    assert status == 201
    status, answered = call(server, "POST", "/api/questions/1/answer", {"answer": "b"})
    assert answered["answer"] == "b"
    status, since = call(server, "GET", "/api/entries/since?since=0")
    assert status == 200 and "latest" in since
    status, settings = call(server, "GET", "/api/settings")
    assert any(f["name"] == "tasks" and f["on"] for f in settings)
    call(server, "POST", "/api/settings", {"key": "features.tasks", "value": False})
    assert not next(f for f in call(server, "GET", "/api/settings")[1] if f["name"] == "tasks")["on"]


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
        status, message = call(server, "POST", "/api/main/message", {"brief": "hello", "idempotency": "k1"})
        assert status in (200, 201)
        n = message.get("n") or message.get("row", {}).get("n") or 1
        call(server, "POST", f"/api/main/message/{n}/react", {"face": "👍"})
        listed = json.dumps(call(server, "GET", "/api/main/reaction")[1], ensure_ascii=False)
        assert '"face": "👍"' in listed and f'"message:{n}"' in listed
        call(server, "POST", f"/api/main/message/{n}/react", {"face": "👍"})
        assert "\"face\"" not in json.dumps(call(server, "GET", "/api/main/reaction")[1], ensure_ascii=False), "the same face again takes it off"
        hooks = f"http://127.0.0.1:{server.port}/hooks/claude"
        for kind, extra in (("SessionStart", {}), ("PreToolUse", {"tool_name": "Agent", "tool_input": {"description": "review the login", "prompt": "read the login flow and report", "subagent_type": "reviewer", "model": "sonnet"}}), ("PostToolUse", {"tool_name": "Agent", "tool_input": {}, "tool_response": "fine"})):
            urlopen(HttpRequest(hooks, data=json.dumps({"hook_event_name": kind, "session_id": "s9", **extra}).encode(), method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
        agents = json.dumps(call(server, "GET", "/api/main/agent")[1])
        assert '"task": "review the login"' in agents and '"type": "reviewer"' in agents and '"status": "done"' in agents
    finally:
        app.runtime().stop()


def test_request_threads_leave_no_connection_behind(server):
    from journal.db.connection import Connection
    database = server.database
    for _ in range(40):
        call(server, "GET", "/api/main/dashboard")
    assert len(database._open) <= 3, f"{len(database._open)} connections open after 40 requests: threads must return theirs to the pool"


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
        status, tree = call(server, "POST", "/api/main/settings", {"features": {"thinking": False}})
        assert status == 200 and tree["features"]["thinking"] is False and len(tree["features"]) > 10 and "viewer" in tree
        n = call(server, "POST", "/api/main/message", {"brief": "hello", "idempotency": "k1"})[1]["n"]
        call(server, "POST", f"/api/main/message/{n}/read", {})
        row = call(server, "GET", f"/api/main/message/{n}")[1]
        assert row["seen"] == ["user", "agent"] and row["completed"] == 0 and row["data"]["delivered"] is True, "read, delivered, not closed"
        call(server, "POST", f"/api/main/message/{n}/react", {"face": "👍"})
        app.console().run(["message", "react", str(n), "🎉"], Where("main", "s1"))
        assert call(server, "GET", f"/api/main/message/{n}")[1]["completed"] > 0, "a face from the agent answers it"
        app.console().run(["plan", "create", "p"], Where("main"))
        app.console().run(["plan", "start", "1"], Where("main", "s1"))
        assert call(server, "GET", "/api/main/plan/1")[1]["data"]["status"] == "active"
        app.console().run(["check", "create", "truthy", "--command", "true"], Where("main"))
        app.console().run(["check", "run", "1"], Where("main"))
        check = call(server, "GET", "/api/main/check/1")[1]
        assert check["data"]["last"]["ok"] is True and "runs" in check["data"]
        app.console().run(["sequence", "create", "release", "--steps", "tag|push"], Where("main"))
        assert [s["title"] for s in call(server, "GET", "/api/main/sequence/1")[1]["sections"]] == ["tag", "push"]
        counts = call(server, "GET", "/api/summary")[1]["environments"][0]["counts"]
        assert {"messages", "suggestions", "todos", "questions"} <= set(counts)
        (tmp_path / "hello.py").write_text("print('hi')\n")
        assert call(server, "GET", "/api/main/file?path=hello.py")[1]["lines"] == 1
        assert "diff" in call(server, "GET", "/api/main/diff?path=hello.py")[1]
        assert call(server, "GET", "/api/main/project-files/find?q=hello")[1][0]["name"] == "hello.py"
        assert call(server, "POST", "/api/main/agent/s1/pause", {})[0] == 409, "an act by session is refused, not a server error"
        listed = call(server, "GET", f"/api/main/message?n={n}")[1]["rows"]
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
        urlopen(HttpRequest(f"http://127.0.0.1:{server.port}/hooks/claude", data=data, method="POST", headers={"Content-Type": "application/json"}), timeout=5).read()
        app.console().run(["task", "create", "the footer", "--start"], Where("main", "s1"))
        work = call(server, "GET", "/api/main/work")[1]["rows"][0]
        assert work["title"] == "the footer" and work["data"]["awaiting"] == "" and work["data"]["todo"] == 1
        app.console().run(["halt", "now", "stuck on the login"], Where("main", "s1"))
        work = call(server, "GET", "/api/main/work")[1]["rows"][0]
        assert work["data"]["awaiting"] == "stuck on the login" and work["data"]["awaiting_since"] > 0
        assert call(server, "GET", "/api/summary")[1]["environments"][0]["work"]["awaiting"] == "stuck on the login"
    finally:
        app.runtime().stop()
