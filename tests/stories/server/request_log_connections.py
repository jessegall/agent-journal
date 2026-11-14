import sqlite3
from threading import Event, Thread

import pytest

from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story
from server.viewer.read_attribution import ReadAttribution
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING


@pytest.fixture
def logging_server(new_story):
    with server_story(new_story(fixture=HookRecordingEnabled), listener_thread_started=False) as server:
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
    server.story.expect_rows(recorded.wait(3))
    recorded.clear()
    server.expect_cli_exit("agent list", "/", 0, "")
    server.story.expect_rows(recorded.wait(3))
    server.story.expect_rows(server.context.request_trace is server.context.viewer.routes.request_trace)
    server.story.expect_rows(log.epoch == epoch)
    server.story.expect_rows(log.counts["recorded"] == 2)


def test_a_locked_database_drops_no_request_row_and_writes_no_warning(logging_server):
    server = logging_server
    log = server.context.request_trace
    with log.connected():
        pass
    previous_log = server.story.system_log_text()
    connection = sqlite3.connect(server.story.home.database, timeout=0, autocommit=True)
    try:
        connection.execute("BEGIN IMMEDIATE")
        log.record(["task", "list"], "cli", 1.0, 0.0, 0)
        log.complete_reads(1, tuple([ReadAttribution("client", "command")]))
    finally:
        connection.execute("ROLLBACK")
        connection.close()
    server.story.expect_rows(log.counts["attempted"] == 1, log.counts["recorded"] == 1, log.counts["dropped"] == 0,
                             log.counts["receipt_attempted"] == 1, log.counts["receipt_recorded"] == 1, log.counts["receipt_dropped"] == 0,
                             server.story.system_log_text() == previous_log)


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
    server.story.expect_rows(completed.wait(3))
    server.story.expect_rows(not log.configuration.enabled, log.container is None)
    completed.clear()
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", f"{HOOK_REQUEST_LOG_SETTING}", "true", "--project"]})
    server.story.expect_rows(completed.wait(3))
    server.story.expect_rows(log.configuration.enabled, log.counts["recorded"] == 1)


def test_the_status_never_shows_a_request_that_is_attempted_and_not_yet_recorded(logging_server, monkeypatch):
    server = logging_server
    log = server.context.request_trace
    append = log.trace_file.append
    writing, release = Event(), Event()

    def paused_append(entries):
        writing.set()
        server.story.expect_rows(release.wait(3), detail="the status read was not held until the write ended")
        append(entries)

    monkeypatch.setattr(log.trace_file, "append", paused_append)
    statuses = []
    writer = Thread(target=log.record, args=(["task", "list"], "cli", 1.0, 0.0, 0))
    reader = Thread(target=lambda: statuses.append(log.status()))
    writer.start()
    server.story.expect_rows(writing.wait(3))
    reader.start()
    reader.join(0.3)
    release.set()
    writer.join()
    reader.join()
    status = statuses[0]
    server.story.expect_rows(status["attempted"] == status["recorded"] + status["dropped"] + status["disabled"])
