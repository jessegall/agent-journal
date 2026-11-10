import http.client
import json
from time import perf_counter
from unittest.mock import patch

import pytest

from server.enums.queue_priority import QueuePriority
from server.viewer.line_route import LineRoute
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story, viewer_answer

SLOW_SECONDS = 0.3
SLOW_LINE = ["agent", "list"]
QUICK_LINE = ["environment", "list"]
REPEATED_WORK = "journal.core.developer.tools.repeated-work"


@pytest.fixture
def recording_server(new_story):
    with server_story(new_story(fixture=HookRecordingEnabled)) as server:
        yield server


def login_session(server) -> str:
    return server.expect_viewer_login(server.viewer_key("Ada"))


def expect_answered(status: int, body: str) -> None:
    assert status == 200, body


def expect_read_lines(reads: set[str]) -> None:
    assert {"task list", "usage tool", "message feed", "agent main"} <= reads
    assert not {"message send", "message edit", "task close", "viewer-layout save"} & reads


def expect_slow_line_logged_slow(line_durations: dict[str, float]) -> None:
    assert line_durations[" ".join(SLOW_LINE)] >= SLOW_SECONDS * 1000, line_durations
    assert line_durations[" ".join(QUICK_LINE)] < SLOW_SECONDS * 1000, line_durations


def expect_environment_event(response: http.client.HTTPResponse, environment: str) -> None:
    assert response.status == 200
    data = ""
    while not data:
        line = response.fp.readline().decode().strip()
        if line.startswith("data:") and '"task.' in line:
            data = line.removeprefix("data:")
    assert json.loads(data)["environment"] == environment


def expect_report_count(server, count: int) -> None:
    log = server.story.home.system_log
    text = log.read_text() if log.exists() else ""
    assert text.count("sent 12 lines of usage tool") == count, text


def test_the_server_lists_the_lines_that_only_read(recording_server):
    server = recording_server
    status, _, body = viewer_answer(server.viewer_port(), "/api/read-lines", login_session(server), "")
    expect_answered(status, body)
    expect_read_lines(set(json.loads(body)["reads"]))


def test_each_line_of_a_batch_logs_its_own_time(recording_server):
    server = recording_server
    cookie = login_session(server)
    answered = LineRoute.batch_answer
    offset = [0.0]

    def delayed_batch_answer(route, container, request, person_id, shared):
        if request.line == SLOW_LINE:
            offset[0] += SLOW_SECONDS + 0.01
        return answered(route, container, request, person_id, shared)

    lines = [{"window": "viewer.shell", "line": line, "environment": "main"} for line in (SLOW_LINE, QUICK_LINE)]
    with patch.object(LineRoute, "batch_answer", delayed_batch_answer), patch("server.viewer.line_route.perf_counter", lambda: perf_counter() + offset[0]):
        status, _, body = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", {"lines": lines})
    expect_answered(status, body)
    rows = server.viewer_line_value(cookie, {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"})["rows"]
    expect_slow_line_logged_slow({row["body"]["event"]: row["duration_ms"] for row in rows if "event" in row["body"]})


def test_one_stream_carries_the_environments_of_many_tabs_and_names_each_events_environment(recording_server):
    server = recording_server
    story = server.story
    cookie = login_session(server)
    port = server.viewer_port()
    connection_query = "/api/events?cursor=0&environment=main&environment=gone&follow=task.*"
    story.expect_success('task make "Fix the cart" --brief "Correct the cart total" --environment main', actor=story.agent)
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=10)
    try:
        connection.request("GET", connection_query, headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
        expect_environment_event(connection.getresponse(), "main")
    finally:
        connection.close()


@pytest.mark.parametrize("setting,reported", [("true", True), ("false", False)])
def test_a_window_sending_many_lines_of_one_noun_and_verb_is_a_development_error_once(recording_server, setting, reported):
    server = recording_server
    cookie = login_session(server)
    server.viewer_line_value(cookie, {"line": ["setting", "switch", "journal.core.developer.tools", "on", "--project"], "environment": "main", "window": "settings.settings"})
    server.viewer_line_value(cookie, {"line": ["setting", "set", REPEATED_WORK, setting, "--project"], "environment": "main", "window": "settings.settings"})
    report = {"window": "agents.cards", "line": "usage tool", "count": 12}
    for _ in range(2):
        status, _, body = viewer_answer(server.viewer_port(), "/api/repeated-lines", cookie, "", report)
        expect_answered(status, body)
    expect_report_count(server, 1 if reported else 0)


def read_time(server, cookie: str, window: str) -> float:
    started_at = perf_counter()
    server.viewer_line_value(cookie, {"line": ["usage", "tool"], "environment": "main", "window": window})
    return perf_counter() - started_at


def expect_early_chat(chat_seconds: float, agent_seconds: float, wait_limit_seconds: float) -> None:
    assert chat_seconds < wait_limit_seconds, chat_seconds
    assert agent_seconds >= wait_limit_seconds, agent_seconds


def test_the_chat_goes_ahead_of_a_running_hook_and_another_window_waits_behind_it(recording_server):
    server = recording_server
    cookie = login_session(server)
    with server.context.hook_database.used(QueuePriority.AGENT_HOOK, 1):
        chat_seconds = read_time(server, cookie, "messages.chat")
        agent_seconds = read_time(server, cookie, "agents.agents")
    expect_early_chat(chat_seconds, agent_seconds, server.context.hook_database.queue.viewer_wait_limit_seconds)
