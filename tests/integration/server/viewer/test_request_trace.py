import sqlite3
from threading import Event, Thread

import pytest

from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING, TOOLS_SETTING
from server.viewer.read_attribution import ReadAttribution
from tests.integration.support.integration_server import integration_server

WAIT_SECONDS = 3


def system_log_text(journal) -> str:
    return journal.home.system_log.read_text() if journal.home.system_log.exists() else ""


@pytest.fixture
def logging_server(journal):
    journal.make_user()
    for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {HOOK_REQUEST_LOG_SETTING} true --project", f"setting set {HOOK_DURATIONS_SETTING} true --project"):
        assert journal.run(line).code == 0, line
    with integration_server(journal, listener_thread_started=False) as server:
        yield server


def test_cli_requests_keep_the_same_logger_counts_and_epoch(logging_server, monkeypatch):
    server = logging_server
    log = server.context.request_trace
    epoch = log.epoch
    recorded = Event()
    record = log.record

    def record_counted(*args):
        try:
            record(*args)
        finally:
            recorded.set()

    monkeypatch.setattr(log, "record", record_counted)
    server.expect_cli_exit("task list", "/", 0, "")
    assert recorded.wait(WAIT_SECONDS)
    recorded.clear()
    server.expect_cli_exit("agent list", "/", 0, "")
    assert recorded.wait(WAIT_SECONDS)
    assert server.context.request_trace is server.context.viewer.routes.request_trace
    assert log.epoch == epoch and log.counts["recorded"] == 2


def test_a_locked_database_drops_no_request_row_and_writes_no_warning(logging_server):
    server = logging_server
    log = server.context.request_trace
    with log.connected():
        pass
    previous_log = system_log_text(server.journal)
    connection = sqlite3.connect(server.journal.home.database, timeout=0, autocommit=True)
    try:
        connection.execute("BEGIN IMMEDIATE")
        log.record(["task", "list"], "cli", 1.0, 0.0, 0)
        log.complete_reads(1, (ReadAttribution("client", "command"),))
    finally:
        connection.execute("ROLLBACK")
        connection.close()
    counts = log.counts
    assert (counts["attempted"], counts["recorded"], counts["dropped"]) == (1, 1, 0), counts
    assert (counts["receipt_attempted"], counts["receipt_recorded"], counts["receipt_dropped"]) == (1, 1, 0), counts
    assert system_log_text(server.journal) == previous_log


def test_a_viewer_setting_change_refreshes_recording_before_the_next_request(logging_server, monkeypatch):
    server = logging_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    log = server.context.request_trace
    completed = Event()
    original_save = log.save_many

    def saved(entries):
        try:
            original_save(entries)
        finally:
            completed.set()

    monkeypatch.setattr(log, "save_many", saved)
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", f"{HOOK_REQUEST_LOG_SETTING}", "false", "--project"]})
    assert completed.wait(WAIT_SECONDS)
    assert not log.configuration.enabled and log.container is None
    completed.clear()
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", f"{HOOK_REQUEST_LOG_SETTING}", "true", "--project"]})
    assert completed.wait(WAIT_SECONDS)
    assert log.configuration.enabled and log.counts["recorded"] == 1


def test_the_status_never_shows_a_request_that_is_attempted_and_not_yet_recorded(logging_server, monkeypatch):
    log = logging_server.context.request_trace
    append = log.trace_file.append
    writing, release = Event(), Event()
    held: list[bool] = []

    def paused_append(entries):
        writing.set()
        held.append(release.wait(WAIT_SECONDS))
        append(entries)

    monkeypatch.setattr(log.trace_file, "append", paused_append)
    statuses = []
    writer = Thread(target=log.record, args=(["task", "list"], "cli", 1.0, 0.0, 0))
    reader = Thread(target=lambda: statuses.append(log.status()))
    writer.start()
    assert writing.wait(WAIT_SECONDS)
    reader.start()
    reader.join(0.3)
    release.set()
    writer.join()
    reader.join()
    assert held == [True], "the status read was not held until the write ended"
    status = statuses[0]
    assert status["attempted"] == status["recorded"] + status["dropped"] + status["disabled"], status
