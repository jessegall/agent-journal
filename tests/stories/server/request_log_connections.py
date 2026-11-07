import json
import sqlite3
from contextlib import contextmanager
from threading import Event

import pytest

from core.base.database.database import Database
from core.modules.developer.support.hook_request_log import HookRequestLog
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn
from tests.stories.server.support.server_client import server_story, viewer_answer
from server.viewer.read_attribution import ReadAttribution


@pytest.fixture
def logging_server(new_story):
    with server_story(new_story(fixture=HookRecordingOn), listener_thread_started=False) as server:
        yield server


@pytest.mark.parametrize("enabled", [False, True])
def test_a_batch_uses_no_logging_connection_when_off_and_one_reused_connection_when_on(new_story, monkeypatch, enabled):
    story = new_story(fixture=HookRecordingOn)
    story.expect_success(f"setting set journal.core.developer.tools.hooks.request-log {str(enabled).lower()} --project", actor=story.user)
    with server_story(story, listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        log = server.context.request_log
        connected, original_save = log.connected, log.save_many
        connections = []
        saved, release = Event(), Event()

        @contextmanager
        def counted():
            story.expect_rows(release.wait(3), detail="the response waited for request logging")
            with connected() as container:
                connections.append(container.get(Database).connection)
                yield container

        def save_counted(entries):
            try:
                original_save(entries)
            finally:
                saved.set()

        monkeypatch.setattr(log, "connected", counted)
        monkeypatch.setattr(log, "save_many", save_counted)
        body = {"lines": [{"window": "tasks.tasks", "environment": "main", "line": ["task", "list", "--limit", str(number)]} for number in range(1, 11)]}
        try:
            status, _, answer = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", body)
            story.expect_rows(status == 200, all(row["code"] == 0 for row in json.loads(answer)["answers"]))
        finally:
            release.set()
        story.expect_rows(saved.wait(3))
        story.expect_rows(len(connections) == int(enabled))
        saved.clear()
        status, _, _ = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", body)
        story.expect_rows(status == 200, saved.wait(3))
        story.expect_rows(len(connections) == 2 * int(enabled))
        if enabled:
            story.expect_rows(connections[0] is connections[1])
        else:
            story.expect_rows(log.container is None)
        story.expect_rows(len(story.container.get(HookRequestLog).read()) == 20 * int(enabled))


def test_cli_requests_keep_the_same_logger_counts_and_epoch(logging_server, monkeypatch):
    server = logging_server
    log = server.context.request_log
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
    server.story.expect_rows(server.context.request_log is server.context.viewer.routes.request_log)
    server.story.expect_rows(log.epoch == epoch)
    server.story.expect_rows(log.counts["recorded"] == 2)


def test_a_locked_request_log_counts_dropped_rows_without_a_warning(logging_server):
    server = logging_server
    log = server.context.request_log
    with log.connected():
        pass
    before = server.story.system_log_text()
    connection = sqlite3.connect(server.story.home.database, timeout=0, autocommit=True)
    try:
        connection.execute("BEGIN IMMEDIATE")
        log.record(["task", "list"], "cli", 1.0, 0.0, 0)
        log.complete_reads(1, (ReadAttribution("client", "command"),))
    finally:
        connection.execute("ROLLBACK")
        connection.close()
    server.story.expect_rows(log.counts["attempted"] == 1, log.counts["dropped"] == 1,
                             log.counts["receipt_attempted"] == 1, log.counts["receipt_dropped"] == 1,
                             server.story.system_log_text() == before)


def test_a_viewer_setting_change_refreshes_recording_before_the_next_request(logging_server, monkeypatch):
    server = logging_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    log = server.context.request_log
    completed = Event()
    original_save = log.save_many

    def saved(entries):
        try:
            original_save(entries)
        finally:
            completed.set()

    monkeypatch.setattr(log, "save_many", saved)
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", "journal.core.developer.tools.hooks.request-log", "false", "--project"]})
    server.story.expect_rows(completed.wait(3))
    server.story.expect_rows(not log.configuration.enabled, log.container is None)
    completed.clear()
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", "journal.core.developer.tools.hooks.request-log", "true", "--project"]})
    server.story.expect_rows(completed.wait(3))
    server.story.expect_rows(log.configuration.enabled, log.counts["recorded"] == 1)
