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
    status, task = call(server, "POST", "/tasks", {"title": "ship it", "brief": "b"})
    assert status == 201 and task["id"] == 1 and task["created_by"] == "user:1"
    status, started = call(server, "POST", "/tasks/1/start")
    assert status == 200 and started["state"] == "started"
    assert call(server, "POST", "/tasks/1/log", {"line": "halfway"})[0] == 201
    status, done = call(server, "POST", "/tasks/1/finish", {"how": "merged"})
    assert done["state"] == "done" and done["outcome"] == "merged"
    status, listed = call(server, "GET", "/tasks")
    assert [t["title"] for t in listed] == ["ship it"]
    assert call(server, "GET", "/tasks", env="other")[1] == []


def test_a_missing_row_and_a_missing_route_say_so(server):
    assert call(server, "GET", "/tasks/9")[0] == 404
    assert call(server, "GET", "/nothing")[0] == 404


def test_the_port_file_is_written_while_serving(server):
    assert int(server.config.port_file.read_text()) == server.port
