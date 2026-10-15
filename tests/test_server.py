"""Phase three: the server answers real HTTP on a free port; tasks are created, read, started and finished over it."""

import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request as HttpRequest, urlopen

import pytest

from journal.app import App
from journal.config import Config


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
