import json
import sqlite3
from threading import Event
from time import perf_counter
from unittest.mock import patch

import pytest

from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING, HOOK_REQUEST_LOG_SIZE_SETTING, TOOLS_SETTING
from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.enums.hook_answer import HookAnswer
from server.viewer.request_trace import SETTINGS_REFRESH_SECONDS
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import viewer_answer


@pytest.fixture
def attributed_server(journal):
    user = journal.make_user()
    assert journal.run("environment make elsewhere /work/elsewhere", environment_id=None).code == 0
    for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {HOOK_REQUEST_LOG_SETTING} true --project",
                 f"setting set {HOOK_DURATIONS_SETTING} true --project", f"setting set {HOOK_REQUEST_LOG_SIZE_SETTING} 10000 --project"):
        assert journal.run(line, user).code == 0, line
    with integration_server(journal, listener_thread_started=False) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user


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
    server.journal.run_tick("request trace import")
    server.journal.run_tick("request trace import")


def records(server, cookie):
    import_trace_rows(server)
    return server.viewer_line_value(cookie, {"window": "developer.hook-requests", "environment": "main",
                                           "line": ["developer", "hook-requests"]})["rows"]


def line(window="agents.agents", environment="main", command="agent list", command_id="read-1", followed_command_id=""):
    return {"window": window, "environment": environment, "line": command.split(),
            "attribution": {"client_id": "browser-1", "command_id": command_id,
                            "joined_callers": 0, "followed_command_id": followed_command_id, "complete": False}}


def test_single_and_batch_requests_name_http_commands_windows_and_environments(attributed_server):
    server, cookie, _ = attributed_server
    single_headers, _ = request(server, cookie, "/api/line", line())
    batch_headers, _ = request(server, cookie, "/api/lines", {"lines": [
        line(command_id="read-2"), line("tasks.tasks", "elsewhere", "task list", "read-3")]})
    rows = records(server, cookie)
    attributed = [row["body"]["attribution"] for row in rows]
    assert len(attributed) == 3, len(attributed)
    assert len({row['request_id'] for row in attributed}) == 2, len({row['request_id'] for row in attributed})
    assert {row['window'] for row in attributed} == {'agents.agents', 'tasks.tasks'}, {row['window'] for row in attributed}
    assert {row['environment'] for row in attributed} == {'main', 'elsewhere'}, {row['environment'] for row in attributed}
    assert {row['child_index'] for row in attributed} == {0, 1}, {row['child_index'] for row in attributed}
    assert sum((row['http_duration_ms'] is not None for row in attributed)) == 2, sum((row['http_duration_ms'] is not None for row in attributed))
    assert all((row['command_duration_ms'] >= 0 for row in attributed))
    assert all((row['received_at'] for row in attributed))
    for name in ("database_points", "database_rows", "database_bytes"):
        assert all((row[name] >= 0 for row in attributed))
        assert any((row[name] > 0 for row in attributed))
    assert single_headers['X-Journal-Request-Id'] != batch_headers['X-Journal-Request-Id']
    _, status = request(server, cookie, "/api/request-log-status")
    assert status['attempted'] == status['recorded'] == 3
    assert status['dropped'] == 0, status['dropped']
    assert status['http_requests'] == 2, status['http_requests']
    assert status['retained'] == 3, status['retained']


def test_late_join_receipts_complete_the_original_rows_and_name_trailing_reads(attributed_server):
    server, cookie, _ = attributed_server
    request(server, cookie, "/api/line", line())
    request(server, cookie, "/api/line", line(command_id="read-2", followed_command_id="read-1"))
    request(server, cookie, "/api/read-receipts", {"receipts": [
        {"client_id": "browser-1", "command_id": "read-1", "joined_callers": 2},
        {"client_id": "browser-1", "command_id": "read-2", "joined_callers": 0}]})
    attributed = [row["body"]["attribution"] for row in records(server, cookie)]
    assert len(attributed) == 2, len(attributed)
    assert all((row['complete'] for row in attributed))
    assert sum((row['joined_callers'] for row in attributed)) == 2, sum((row['joined_callers'] for row in attributed))
    assert sum((bool(row['followed_command_id']) for row in attributed)) == 1, sum((bool(row['followed_command_id']) for row in attributed))
    _, status = request(server, cookie, "/api/request-log-status")
    assert status['receipt_attempted'] == status['receipt_recorded'] == 2
    assert status['receipt_dropped'] == 0, status['receipt_dropped']


def test_contention_drops_no_row_and_a_tick_writes_it_once_the_database_is_free(attributed_server):
    server, cookie, _ = attributed_server
    with sqlite3.connect(server.journal.home.database, autocommit=True) as writer:
        writer.execute("BEGIN IMMEDIATE")
        request(server, cookie, "/api/line", line())
        writer.execute("ROLLBACK")
    _, status = request(server, cookie, "/api/request-log-status")
    assert status['attempted'] == 1, status['attempted']
    assert status['recorded'] == 1, status['recorded']
    assert status['dropped'] == 0, status['dropped']
    assert len(records(server, cookie)) == 1, len(records(server, cookie))


def test_retention_loss_is_visible_and_receipts_are_kept_in_their_order(attributed_server):
    server, cookie, _ = attributed_server
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", HOOK_REQUEST_LOG_SIZE_SETTING, "1", "--project"]})
    for number in range(3):
        request(server, cookie, "/api/line", line(command_id=f"read-{number}"))
    request(server, cookie, "/api/read-receipts", {"receipts": [
        {"client_id": "browser-1", "command_id": "read-0", "joined_callers": 1}]})
    import_trace_rows(server)
    _, status = request(server, cookie, "/api/request-log-status")
    assert status['recorded'] == 4, status['recorded']
    assert status['retained'] == 1, status['retained']
    assert status['receipt_recorded'] == 1, status['receipt_recorded']
    assert status['receipt_dropped'] == 0, status['receipt_dropped']
    assert status['retention_limit'] == 1, status['retention_limit']


def test_logging_off_keeps_no_rows_or_receipt_writes(attributed_server, monkeypatch):
    server, cookie, user = attributed_server
    assert server.journal.run(f"setting set {HOOK_REQUEST_LOG_SETTING} false --project", user).code == 0
    monkeypatch.setattr("server.viewer.request_trace.perf_counter", lambda: perf_counter() + SETTINGS_REFRESH_SECONDS)
    request(server, cookie, "/api/line", line())
    _, status = request(server, cookie, "/api/request-log-status")
    assert status['enabled'] == False, status['enabled']
    assert status['recorded'] == status['dropped'] == 0
    assert status['disabled'] == 1, status['disabled']
    assert records(server, cookie) == [], records(server, cookie)


def test_legacy_line_requests_and_historical_rows_still_display(attributed_server):
    server, cookie, _ = attributed_server
    server.journal.container.get(HookRequestLog).record("", {}, {"event": "Legacy event"}, 2.5, HookAnswer.ALLOWED, role="viewer")
    request(server, cookie, "/api/line", {"window": "agents.agents", "line": ["agent", "list"], "environment": "main"})
    row = records(server, cookie)[0]
    assert row['event'] == 'agent list', row['event']
    assert row['body']['attribution']['complete']
    assert row['duration_ms'] >= 0
    historical = records(server, cookie)[1]
    assert historical['event'] == 'Legacy event', historical['event']
    assert historical['body'] == {'event': 'Legacy event'}, historical['body']
    assert historical['duration_ms'] == 2.5, historical['duration_ms']
