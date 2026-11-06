import http.client
import json
from time import sleep
from unittest.mock import patch

import pytest

from server.viewer.line_route import LineRoute
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn
from tests.stories.server.support.server_client import server_story, viewer_answer

SLOW_SECONDS = 0.3
SLOW_LINE = ["agent", "list"]
QUICK_LINE = ["environment", "list"]
REPEATED_WORK = "journal.core.developer.tools.repeated-work"


@pytest.fixture
def recording_server(new_story):
    with server_story(new_story(fixture=HookRecordingOn)) as server:
        yield server


def logged_in(server) -> str:
    return server.expect_viewer_login(server.viewer_key("Ada"))


def test_the_server_lists_the_lines_that_only_read(recording_server):
    server = recording_server
    status, _, body = viewer_answer(server.viewer_port(), "/api/read-lines", logged_in(server), "")
    assert status == 200, body
    reads = set(json.loads(body)["reads"])
    assert {"task list", "usage tool", "message feed", "agent main"} <= reads
    assert not {"message send", "message edit", "task close", "viewer-layout save"} & reads


def test_each_line_of_a_batch_logs_its_own_time(recording_server):
    server = recording_server
    cookie = logged_in(server)
    answered = LineRoute.batch_answer

    def slow_for_one_line(route, container, request, person_id, shared):
        if request.line == SLOW_LINE:
            sleep(SLOW_SECONDS)
        return answered(route, container, request, person_id, shared)

    lines = [{"window": "viewer.shell", "line": line, "environment": "main"} for line in (SLOW_LINE, QUICK_LINE)]
    with patch.object(LineRoute, "batch_answer", slow_for_one_line):
        status, _, body = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", {"lines": lines})
    assert status == 200, body
    rows = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})["rows"]
    duration_of = {row["body"]["event"]: row["duration_ms"] for row in rows if "event" in row["body"]}
    assert duration_of[" ".join(SLOW_LINE)] >= SLOW_SECONDS * 1000, duration_of
    assert duration_of[" ".join(QUICK_LINE)] < SLOW_SECONDS * 1000, duration_of


def test_one_stream_carries_the_environments_of_many_tabs_and_names_each_events_environment(recording_server):
    server = recording_server
    story = server.story
    cookie = logged_in(server)
    port = server.viewer_port()
    connection_query = "/api/events?cursor=0&environment=main&environment=gone&follow=task.*"
    story.expect_success('task make "Fix the cart" --brief "Correct the cart total" --environment main', actor=story.agent)
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=10)
    try:
        connection.request("GET", connection_query, headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
        response = connection.getresponse()
        assert response.status == 200
        data = ""
        while not data:
            line = response.fp.readline().decode().strip()
            if line.startswith("data:") and '"task.' in line:
                data = line.removeprefix("data:")
        assert json.loads(data)["environment"] == "main"
    finally:
        connection.close()


@pytest.mark.parametrize("setting,reported", [("true", True), ("false", False)])
def test_a_window_sending_many_lines_of_one_noun_and_verb_is_a_development_error_once(recording_server, setting, reported):
    server = recording_server
    cookie = logged_in(server)
    server.viewer_line_value(cookie, {"line": ["setting", "switch", "journal.core.developer.tools", "on", "--project"], "environment": "main", "window": "settings.settings"})
    server.viewer_line_value(cookie, {"line": ["setting", "set", REPEATED_WORK, setting, "--project"], "environment": "main", "window": "settings.settings"})
    report = {"window": "agents.cards", "line": "usage tool", "count": 12}
    for _ in range(2):
        status, _, body = viewer_answer(server.viewer_port(), "/api/repeated-lines", cookie, "", report)
        assert status == 200, body
    log = server.story.home.error_log
    text = log.read_text() if log.exists() else ""
    assert text.count("sent 12 lines of usage tool") == (1 if reported else 0), text
