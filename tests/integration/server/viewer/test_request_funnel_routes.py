import http.client
import json
from time import perf_counter
from unittest.mock import patch

import pytest

from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING, REPEATED_WORK_SETTING, TOOLS_SETTING
from server.viewer.line_route import LineRoute
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import TIMEOUT_SECONDS, viewer_answer

SLOW_SECONDS = 0.3
SLOW_LINE = ["agent", "list"]
QUICK_LINE = ["environment", "list"]


# a user, Ada, logged in to a server that records each request, with the developer tools on
@pytest.fixture
def recording_server(journal):
    journal.make_user()
    with integration_server(journal) as server:
        for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {HOOK_REQUEST_LOG_SETTING} true --project", f"setting set {HOOK_DURATIONS_SETTING} true --project"):
            server.expect_cli_exit(line, "/", 0, "")
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


def environment_of_first_task_event(response: http.client.HTTPResponse) -> str:
    assert response.status == 200
    while True:
        line = response.fp.readline().decode().strip()
        if line.startswith("data:") and '"task.' in line:
            return json.loads(line.removeprefix("data:"))["environment"]


def test_the_server_lists_the_lines_that_only_read(recording_server):
    server, cookie = recording_server
    status, _, body = viewer_answer(server.viewer_port(), "/api/read-lines", cookie, "")
    assert status == 200, body
    reads = set(json.loads(body)["reads"])
    assert {"task list", "usage tool", "message feed", "agent main"} <= reads
    assert not {"message send", "message edit", "task close", "viewer-layout save"} & reads


def test_each_line_of_a_batch_logs_its_own_time(recording_server):
    server, cookie = recording_server
    answered = LineRoute.batch_answer
    offset = [0.0]

    def delayed_batch_answer(route, container, request, person_id, shared):
        if request.line == SLOW_LINE:
            offset[0] += SLOW_SECONDS + 0.01
        return answered(route, container, request, person_id, shared)

    lines = [{"window": "viewer.shell", "line": line, "environment": "main"} for line in (SLOW_LINE, QUICK_LINE)]
    with patch.object(LineRoute, "batch_answer", delayed_batch_answer), patch("server.viewer.line_route.perf_counter", lambda: perf_counter() + offset[0]):
        status, _, body = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", {"lines": lines})
    assert status == 200, body
    server.journal.run_tick("request trace import")
    server.journal.run_tick("request trace import")
    rows = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})["rows"]
    durations = {row["body"]["event"]: row["duration_ms"] for row in rows if "event" in row["body"]}
    assert durations[" ".join(SLOW_LINE)] >= SLOW_SECONDS * 1000 and durations[" ".join(QUICK_LINE)] < SLOW_SECONDS * 1000, durations


def test_one_stream_carries_the_environments_of_many_tabs_and_names_each_events_environment(recording_server):
    server, cookie = recording_server
    port = server.viewer_port()
    assert server.journal.run('task make "Fix the cart" --brief "Correct the cart total" --environment main').code == 0
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
    try:
        connection.request("GET", "/api/events?cursor=0&environment=main&environment=gone&follow=task.*", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
        assert environment_of_first_task_event(connection.getresponse()) == "main"
    finally:
        connection.close()


@pytest.mark.parametrize("setting,reported", [("true", True), ("false", False)])
def test_a_window_sending_many_lines_of_one_noun_and_verb_is_a_development_error_once(recording_server, setting, reported):
    server, cookie = recording_server
    server.viewer_line_value(cookie, {"line": ["setting", "set", REPEATED_WORK_SETTING, setting, "--project"], "environment": "main", "window": "settings.settings"})
    report = {"window": "agents.cards", "line": "usage tool", "count": 12}
    for _ in range(2):
        status, _, body = viewer_answer(server.viewer_port(), "/api/repeated-lines", cookie, "", report)
        assert status == 200, body
    log = server.journal.home.system_log
    text = log.read_text() if log.exists() else ""
    assert text.count("sent 12 lines of usage tool") == (1 if reported else 0), text
