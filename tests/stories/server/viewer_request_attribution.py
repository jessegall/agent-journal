import json
import sqlite3

import pytest

from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn
from tests.stories.server.support.server_client import server_story, viewer_answer


@pytest.fixture
def attributed_server(new_story):
    story = new_story(fixture=HookRecordingOn)
    story.expect_success("environment make elsewhere /work/elsewhere")
    story.expect_success("setting set journal.core.developer.tools.hooks.request-log-size 10000 --project", actor=story.user)
    with server_story(story, listener_thread_started=False) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


def request(server, cookie, path, body=None):
    status, headers, text = viewer_answer(server.viewer_port(), path, cookie, "", body)
    assert status == 200, text
    return headers, json.loads(text)


def records(server, cookie):
    return server.viewer_line_value(cookie, {"window": "developer.hook-requests", "environment": "main",
                                           "line": ["developer", "hook-requests"]})["rows"]


def line(window="agents.agents", environment="main", command="agent list", command_id="read-1", trailing_of=""):
    return {"window": window, "environment": environment, "line": command.split(),
            "attribution": {"client_id": "browser-1", "command_id": command_id,
                            "joined_callers": 0, "trailing_of": trailing_of, "complete": False}}


def test_single_and_batch_requests_name_http_commands_windows_and_environments(attributed_server):
    server, cookie = attributed_server
    single_headers, _ = request(server, cookie, "/api/line", line())
    batch_headers, _ = request(server, cookie, "/api/lines", {"lines": [
        line(command_id="read-2"), line("tasks.tasks", "elsewhere", "task list", "read-3")]})
    rows = records(server, cookie)
    attributed = [row["body"]["attribution"] for row in rows]
    assert len(attributed) == 3
    assert len({row["request_id"] for row in attributed}) == 2
    assert {row["window"] for row in attributed} == {"agents.agents", "tasks.tasks"}
    assert {row["environment"] for row in attributed} == {"main", "elsewhere"}
    assert {row["child_index"] for row in attributed} == {0, 1}
    assert sum(row["http_duration_ms"] is not None for row in attributed) == 2
    assert all(row["command_duration_ms"] >= 0 for row in attributed)
    assert all(row["received_at"] for row in attributed)
    assert single_headers["X-Journal-Request-Id"] != batch_headers["X-Journal-Request-Id"]
    _, status = request(server, cookie, "/api/request-log-status")
    assert status["attempted"] == status["recorded"] == 3
    assert status["dropped"] == 0
    assert status["http_requests"] == 2
    assert status["retained"] == 3


def test_late_join_receipts_complete_the_original_rows_and_name_trailing_reads(attributed_server):
    server, cookie = attributed_server
    request(server, cookie, "/api/line", line())
    request(server, cookie, "/api/line", line(command_id="read-2", trailing_of="read-1"))
    request(server, cookie, "/api/read-receipts", {"receipts": [
        {"client_id": "browser-1", "command_id": "read-1", "joined_callers": 2},
        {"client_id": "browser-1", "command_id": "read-2", "joined_callers": 0}]})
    attributed = [row["body"]["attribution"] for row in records(server, cookie)]
    assert len(attributed) == 2
    assert all(row["complete"] for row in attributed)
    assert sum(row["joined_callers"] for row in attributed) == 2
    assert sum(bool(row["trailing_of"]) for row in attributed) == 1
    _, status = request(server, cookie, "/api/request-log-status")
    assert status["receipt_attempted"] == status["receipt_recorded"] == 2
    assert status["receipt_dropped"] == 0


def test_contention_is_counted_as_a_drop_without_waiting_or_retrying(attributed_server):
    server, cookie = attributed_server
    with sqlite3.connect(server.story.home.database, autocommit=True) as writer:
        writer.execute("BEGIN IMMEDIATE")
        request(server, cookie, "/api/line", line())
        writer.rollback()
    _, status = request(server, cookie, "/api/request-log-status")
    assert status["attempted"] == 1
    assert status["recorded"] == 0
    assert status["dropped"] == 1
    assert records(server, cookie) == []


def test_retention_loss_and_receipts_for_evicted_rows_are_visible(attributed_server):
    server, cookie = attributed_server
    server.story.expect_success("setting set journal.core.developer.tools.hooks.request-log-size 1 --project", actor=server.story.user)
    for number in range(3):
        request(server, cookie, "/api/line", line(command_id=f"read-{number}"))
    request(server, cookie, "/api/read-receipts", {"receipts": [
        {"client_id": "browser-1", "command_id": "read-0", "joined_callers": 1}]})
    _, status = request(server, cookie, "/api/request-log-status")
    assert status["recorded"] == 3
    assert status["retained"] == 1
    assert status["receipt_dropped"] == 1
    assert status["retention_limit"] == 1


def test_logging_off_keeps_no_rows_or_receipt_writes(attributed_server):
    server, cookie = attributed_server
    server.story.expect_success("setting set journal.core.developer.tools.hooks.request-log false --project", actor=server.story.user)
    request(server, cookie, "/api/line", line())
    _, status = request(server, cookie, "/api/request-log-status")
    assert status["enabled"] is False
    assert status["recorded"] == status["dropped"] == 0
    assert status["disabled"] == 1
    assert records(server, cookie) == []


def test_legacy_line_requests_and_historical_rows_still_display(attributed_server):
    server, cookie = attributed_server
    request(server, cookie, "/api/line", {"window": "agents.agents", "line": ["agent", "list"], "environment": "main"})
    row = records(server, cookie)[0]
    assert row["event"] == "agent list"
    assert row["body"]["attribution"]["complete"] is True
    assert row["duration_ms"] >= 0
