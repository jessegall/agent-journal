import json
import sqlite3

import pytest

from engine.log.error_log import ErrorLog
from engine.file.file_access import FileAccess
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from core.modules.profiles.support.profile_folder_move import ProfileFolderMove
from engine.testing.examples.hook_samples import HookSamples
from server.request.request_log import RequestLog
from server.request.request_log_settings import RequestLogSettings
from core.base.serving.server_files import ServerFiles
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story

FINISHED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")


@pytest.fixture
def logs_server(new_story):
    with server_story(new_story(fixture=HookRecordingEnabled)) as server:
        path = server.story.home.system_log
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path.with_name("server.log.1"), "2026-01-01T10:00:00+00:00 info server older server line\n")
        FileAccess.shared().write(path, "2026-01-01T11:00:00+00:00 warning server server warning\nserver output\n")
        server.story.container.get(ErrorLog).reported(["sample"], RuntimeError("sample failure"))
        server.story.container.get(SystemLogWriter).write(LogLevel.INFORMATION, "stop allowed: no open task")
        yield server


def read_logs(server, *flags):
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    return server.viewer_line_value(cookie, {"line": ["developer", "system-logs", *flags], "environment": "main", "window": "developer.system-logs"})


def test_system_logs_read_existing_files_and_notes_through_the_viewer_route(logs_server):
    value = read_logs(logs_server)
    lines = value["rows"]
    logs_server.story.expect_rows(
        {line["source"] for line in lines} == {"server", "journal"},
        any(line["text"] == "stop allowed: no open task" and line["level"] == "info" for line in lines),
        any(line["text"] == "RuntimeError: sample failure" and line["level"] == "error" for line in lines),
        [line["recorded_at"] for line in lines] == sorted((line["recorded_at"] for line in lines), reverse=True),
        lines[-1]["text"] == "older server line",
    )


def test_system_logs_filter_before_paging_and_show_raw_output_as_a_server_warning(logs_server):
    first = read_logs(logs_server, "--source", "server", "--level", "warning", "--limit", "1")
    second = read_logs(logs_server, "--source", "server", "--level", "warning", "--limit", "1", "--page", "2")
    logs_server.story.expect_rows(first["total"] == 2, first["size"] == 1, second["page"] == 2,
                                first["rows"][0]["text"] == "server output",
                                second["rows"][0]["text"] == "server warning")
    logs_server.story.expect_rows(read_logs(logs_server, "--source", "bypass")["rows"] == [])


def test_system_logs_read_an_empty_home_without_creating_files(logs_server):
    path = logs_server.story.home.system_log
    for log in (path, path.with_name("server.log.1")):
        log.unlink(missing_ok=True)
    value = read_logs(logs_server)
    logs_server.story.expect_rows(value["rows"] == [], value["total"] == 0, not path.exists())


def test_system_logs_keep_unstructured_lines_and_invalid_bytes(logs_server):
    path = logs_server.story.home.system_log
    FileAccess.shared().write_binary(path, b"raw server output\n2026-99-99T11:00:00+00:00 invalid date\ninvalid byte: \xff\n")
    lines = read_logs(logs_server, "--source", "server")["rows"]
    logs_server.story.expect_rows([line["text"] for line in lines[:3]] == ["invalid byte: \ufffd", "2026-99-99T11:00:00+00:00 invalid date", "raw server output"])


def test_each_writer_shows_on_the_page_with_its_source_and_level(logs_server, monkeypatch):
    def refused_connection():
        raise sqlite3.OperationalError("database is locked")
    def refused_copy():
        raise PermissionError("read-only profile folder")
    story = logs_server.story
    with monkeypatch.context() as slow_rules:
        slow_rules.setattr("engine.driver.driver_rules.SLOW_RULE_SECONDS", 0)
        story.hook("s-1", FINISHED)
    ServerFiles(story.home).log_line("sample server line")
    request_log = RequestLog(story.home, story.clock)
    request_log.configuration = RequestLogSettings(True, 10)
    monkeypatch.setattr(request_log, "connected", refused_connection)
    request_log.record(["task", "list"], "cli", 1.0, 0.0, 0)
    request_log.complete_reads(1, ())
    move = story.container.get(ProfileFolderMove)
    monkeypatch.setattr(move, "run", refused_copy)
    move.publish()
    FileAccess.shared().write(story.home.bypass_log, "1700000000 hook claude\n2026-11-06T10:00:00Z the server did not answer, so process 7 ran as it is: ls\n")
    story.hook("s-1", FINISHED)
    story.run_listeners()
    lines = read_logs(logs_server, "--limit", "200")["rows"]
    shown = {text: next((line["source"], line["level"]) for line in lines if text in line["text"]) for text in (
        "RuntimeError: sample failure", "journal sample", "stop allowed: no open task", "sample server line",
        "request recording failed: database is locked", "read receipt recording failed: database is locked",
        "Profiles left unchanged", "1700000000 hook claude", "process 7 ran as it is: ls", " ms on a ")}
    story.expect_rows(shown == {
        "RuntimeError: sample failure": ("journal", "error"),
        "journal sample": ("journal", "error"),
        "stop allowed: no open task": ("journal", "info"),
        "sample server line": ("server", "info"),
        "request recording failed: database is locked": ("server", "warning"),
        "read receipt recording failed: database is locked": ("server", "warning"),
        "Profiles left unchanged": ("journal", "warning"),
        "1700000000 hook claude": ("bypass", "warning"),
        "process 7 ran as it is: ls": ("bypass", "warning"),
        " ms on a ": ("journal", "info"),
    })


def test_system_logs_navigation_depends_on_developer_tools_and_not_request_recording(logs_server):
    cookie = logs_server.expect_viewer_login(logs_server.viewer_key("Ada"))
    for tools, recording, visible in (("on", "false", True), ("off", "true", False)):
        for line in (["setting", "switch", "journal.core.developer.tools", tools, "--project"],
                     ["setting", "set", "journal.core.developer.tools.hooks.request-log", recording, "--project"]):
            logs_server.viewer_line_value(cookie, {"line": line, "environment": "main", "window": "settings.settings"})
        status, body, _ = logs_server.viewer_download("/api/windows?environment=main", cookie)
        windows = json.loads(body)["windows"]
        logs_server.story.expect_rows(status == 200, any(window["name"] == "developer.system-logs" for window in windows) is visible)
