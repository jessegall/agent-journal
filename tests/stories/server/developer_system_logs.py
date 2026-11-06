import json

import pytest

from core.base.error_log import ErrorLog
from core.base.file_access import FileAccess
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn
from tests.stories.server.support.server_client import server_story


@pytest.fixture
def logs_server(new_story):
    with server_story(new_story(fixture=HookRecordingOn)) as server:
        runtime = server.story.home.error_log.parent
        runtime.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(runtime / "server.log.1", "2026-01-01T10:00:00+00:00 INFO older server line\n")
        FileAccess.shared().write(runtime / "server.log", "2026-01-01T11:00:00+00:00 WARNING server warning\nserver continuation\n")
        FileAccess.shared().write(server.story.home.error_log, "")
        log = server.story.container.get(ErrorLog)
        log.reported(["sample"], RuntimeError("sample failure"))
        log.noted("stop allowed: no open task")
        yield server


def read_logs(server, *flags):
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    return server.viewer_line_value(cookie, {"line": ["developer", "system-logs", *flags], "environment": "main", "window": "developer.system-logs"})


def test_system_logs_read_existing_files_and_notes_through_the_viewer_route(logs_server):
    value = read_logs(logs_server)
    lines = value["rows"]
    logs_server.story.expect_rows(
        {line["source"] for line in lines} == {"server", "error", "journal"},
        any(line["text"].endswith("stop allowed: no open task") and line["level"] == "info" for line in lines),
        any(line["text"] == "RuntimeError: sample failure" and line["level"] == "error" for line in lines),
        [line["recorded_at"] for line in lines] == sorted((line["recorded_at"] for line in lines), reverse=True),
        lines[-1]["text"].endswith("older server line"),
    )


def test_system_logs_filter_before_paging_and_keep_continuation_lines(logs_server):
    first = read_logs(logs_server, "--source", "server", "--level", "warning", "--limit", "1")
    second = read_logs(logs_server, "--source", "server", "--level", "warning", "--limit", "1", "--page", "2")
    logs_server.story.expect_rows(first["total"] == 2, first["size"] == 1, second["page"] == 2,
                                first["rows"][0]["text"] == "server continuation",
                                second["rows"][0]["text"].endswith("server warning"))
    logs_server.story.expect_rows(read_logs(logs_server, "--source", "journal", "--level", "error")["rows"] == [])


def test_system_logs_read_an_empty_home_without_creating_files(logs_server):
    runtime = logs_server.story.home.error_log.parent
    for name in ("server.log", "server.log.1", "errors.log", "errors.log.1"):
        (runtime / name).unlink(missing_ok=True)
    value = read_logs(logs_server)
    logs_server.story.expect_rows(value["rows"] == [], value["total"] == 0, not (runtime / "errors.log").exists())


def test_system_logs_keep_unstructured_lines_and_invalid_bytes(logs_server):
    path = logs_server.story.home.error_log.parent / "server.log"
    FileAccess.shared().write_binary(path, b"raw server output\n2026-99-99T11:00:00+00:00 invalid date\ninvalid byte: \xff\n")
    lines = read_logs(logs_server, "--source", "server")["rows"]
    logs_server.story.expect_rows([line["text"] for line in lines[:3]] == ["invalid byte: \ufffd", "2026-99-99T11:00:00+00:00 invalid date", "raw server output"])


def test_system_logs_navigation_depends_on_developer_tools_and_not_request_recording(logs_server):
    cookie = logs_server.expect_viewer_login(logs_server.viewer_key("Ada"))
    for tools, recording, visible in (("on", "false", True), ("off", "true", False)):
        for line in (["setting", "switch", "journal.core.developer.tools", tools, "--project"],
                     ["setting", "set", "journal.core.developer.tools.hooks.request-log", recording, "--project"]):
            logs_server.viewer_line_value(cookie, {"line": line, "environment": "main", "window": "settings.settings"})
        status, body, _ = logs_server.viewer_download("/api/windows?environment=main", cookie)
        windows = json.loads(body)["windows"]
        logs_server.story.expect_rows(status == 200, any(window["name"] == "developer.system-logs" for window in windows) is visible)
