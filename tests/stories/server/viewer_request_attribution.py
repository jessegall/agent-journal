import json
import sqlite3
from threading import Event
from time import perf_counter
from unittest.mock import patch

import pytest

from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.support.story_checks import expect_value
from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.enums.hook_answer import HookAnswer
from server.viewer.request_trace import SETTINGS_REFRESH_SECONDS
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SIZE_SETTING


@pytest.fixture
def attributed_server(new_story):
    story = new_story(fixture=HookRecordingEnabled)
    story.expect_success("environment make elsewhere /work/elsewhere")
    story.expect_success(f"setting set {HOOK_REQUEST_LOG_SIZE_SETTING} 10000 --project", actor=story.user)
    with server_story(story, listener_thread_started=False) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


def request(server, cookie, path, body=None):
    if path not in ("/api/line", "/api/lines", "/api/read-receipts"):
        status, headers, text = viewer_answer(server.viewer_port(), path, cookie, "", body)
        assert status == 200, text
        return headers, json.loads(text)
    recorded = Event()
    method = "complete_reads" if path == "/api/read-receipts" else "save_many"
    save = getattr(server.context.request_trace, method)

    def save_recorded(*args):
        try:
            save(*args)
        finally:
            recorded.set()

    with patch.object(server.context.request_trace, method, save_recorded):
        status, headers, text = viewer_answer(server.viewer_port(), path, cookie, "", body)
        assert recorded.wait(3), "the server did not finish recording the answered request"
    assert status == 200, text
    return headers, json.loads(text)


def import_trace_rows(server):
    # the first round moves the trace file aside, the next writes what it holds
    server.story.run_tick("request trace import")
    server.story.run_tick("request trace import")


def records(server, cookie):
    import_trace_rows(server)
    return server.viewer_line_value(cookie, {"window": "developer.hook-requests", "environment": "main",
                                           "line": ["developer", "hook-requests"]})["rows"]


def line(window="agents.agents", environment="main", command="agent list", command_id="read-1", followed_command_id=""):
    return {"window": window, "environment": environment, "line": command.split(),
            "attribution": {"client_id": "browser-1", "command_id": command_id,
                            "joined_callers": 0, "followed_command_id": followed_command_id, "complete": False}}


def test_single_and_batch_requests_name_http_commands_windows_and_environments(attributed_server):
    server, cookie = attributed_server
    single_headers, _ = request(server, cookie, "/api/line", line())
    batch_headers, _ = request(server, cookie, "/api/lines", {"lines": [
        line(command_id="read-2"), line("tasks.tasks", "elsewhere", "task list", "read-3")]})
    rows = records(server, cookie)
    attributed = [row["body"]["attribution"] for row in rows]
    expect_value(len(attributed), 3)
    expect_value(len({row["request_id"] for row in attributed}), 2)
    expect_value({row["window"] for row in attributed}, {"agents.agents", "tasks.tasks"})
    expect_value({row["environment"] for row in attributed}, {"main", "elsewhere"})
    expect_value({row["child_index"] for row in attributed}, {0, 1})
    expect_value(sum(row["http_duration_ms"] is not None for row in attributed), 2)
    expect_value(all(row["command_duration_ms"] >= 0 for row in attributed), True)
    expect_value(all(row["received_at"] for row in attributed), True)
    for name in ("database_points", "database_rows", "database_bytes"):
        expect_value(all(row[name] >= 0 for row in attributed), True)
        expect_value(any(row[name] > 0 for row in attributed), True)
    expect_value(single_headers["X-Journal-Request-Id"] != batch_headers["X-Journal-Request-Id"], True)
    _, status = request(server, cookie, "/api/request-log-status")
    expect_value(status["attempted"] == status["recorded"] == 3, True)
    expect_value(status["dropped"], 0)
    expect_value(status["http_requests"], 2)
    expect_value(status["retained"], 3)


def test_late_join_receipts_complete_the_original_rows_and_name_trailing_reads(attributed_server):
    server, cookie = attributed_server
    request(server, cookie, "/api/line", line())
    request(server, cookie, "/api/line", line(command_id="read-2", followed_command_id="read-1"))
    request(server, cookie, "/api/read-receipts", {"receipts": [
        {"client_id": "browser-1", "command_id": "read-1", "joined_callers": 2},
        {"client_id": "browser-1", "command_id": "read-2", "joined_callers": 0}]})
    attributed = [row["body"]["attribution"] for row in records(server, cookie)]
    expect_value(len(attributed), 2)
    expect_value(all(row["complete"] for row in attributed), True)
    expect_value(sum(row["joined_callers"] for row in attributed), 2)
    expect_value(sum(bool(row["followed_command_id"]) for row in attributed), 1)
    _, status = request(server, cookie, "/api/request-log-status")
    expect_value(status["receipt_attempted"] == status["receipt_recorded"] == 2, True)
    expect_value(status["receipt_dropped"], 0)


def test_contention_drops_no_row_and_a_tick_writes_it_once_the_database_is_free(attributed_server):
    server, cookie = attributed_server
    with sqlite3.connect(server.story.home.database, autocommit=True) as writer:
        writer.execute("BEGIN IMMEDIATE")
        request(server, cookie, "/api/line", line())
        writer.rollback()
    _, status = request(server, cookie, "/api/request-log-status")
    expect_value(status["attempted"], 1)
    expect_value(status["recorded"], 1)
    expect_value(status["dropped"], 0)
    expect_value(len(records(server, cookie)), 1)


def test_retention_loss_is_visible_and_receipts_are_kept_in_their_order(attributed_server):
    server, cookie = attributed_server
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", HOOK_REQUEST_LOG_SIZE_SETTING, "1", "--project"]})
    for number in range(3):
        request(server, cookie, "/api/line", line(command_id=f"read-{number}"))
    request(server, cookie, "/api/read-receipts", {"receipts": [
        {"client_id": "browser-1", "command_id": "read-0", "joined_callers": 1}]})
    import_trace_rows(server)
    _, status = request(server, cookie, "/api/request-log-status")
    expect_value(status["recorded"], 4)
    expect_value(status["retained"], 1)
    expect_value(status["receipt_recorded"], 1)
    expect_value(status["receipt_dropped"], 0)
    expect_value(status["retention_limit"], 1)


def test_logging_off_keeps_no_rows_or_receipt_writes(attributed_server, monkeypatch):
    server, cookie = attributed_server
    server.story.expect_success(f"setting set {HOOK_REQUEST_LOG_SETTING} false --project", actor=server.story.user)
    monkeypatch.setattr("server.viewer.request_trace.perf_counter", lambda: perf_counter() + SETTINGS_REFRESH_SECONDS)
    request(server, cookie, "/api/line", line())
    _, status = request(server, cookie, "/api/request-log-status")
    expect_value(status["enabled"], False)
    expect_value(status["recorded"] == status["dropped"] == 0, True)
    expect_value(status["disabled"], 1)
    expect_value(records(server, cookie), [])


def test_legacy_line_requests_and_historical_rows_still_display(attributed_server):
    server, cookie = attributed_server
    server.story.container.get(HookRequestLog).record("", {}, {"event": "Legacy event"}, 2.5, HookAnswer.ALLOWED, role="viewer")
    request(server, cookie, "/api/line", {"window": "agents.agents", "line": ["agent", "list"], "environment": "main"})
    row = records(server, cookie)[0]
    expect_value(row["event"], "agent list")
    expect_value(row["body"]["attribution"]["complete"], True)
    expect_value(row["duration_ms"] >= 0, True)
    historical = records(server, cookie)[1]
    expect_value(historical["event"], "Legacy event")
    expect_value(historical["body"], {"event": "Legacy event"})
    expect_value(historical["duration_ms"], 2.5)
