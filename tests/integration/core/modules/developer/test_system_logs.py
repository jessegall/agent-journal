import json

import pytest

from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING, TOOLS_SETTING
from core.modules.profiles.support.profile_folder_move import ProfileFolderMove
from engine.database.listener_cursor_table import ListenerCursorTable
from engine.enums.log_level import LogLevel
from engine.file.file_access import FileAccess
from engine.log.error_log import ErrorLog
from engine.log.system_log_writer import SystemLogWriter
from engine.serving.server_files import ServerFiles
from engine.testing.examples.hook_samples import HookSamples
from engine.time.polled_wait import PolledWait
from server.viewer.request_trace import RequestTrace
from server.viewer.request_trace_settings import RequestTraceSettings
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import SYSTEM_CLOCK

SESSION = "s-1"


def finished_edit(event_id: str) -> dict[str, object]:
    return dict(HookSamples.edit("src/cart.py").with_fields(event="post_tool_use", session=SESSION, event_id=event_id).body)


# a server whose system log holds an older rotated file, a warning and raw output, an error and a note
@pytest.fixture
def logs_server(journal):
    journal.make_user()
    with integration_server(journal) as server:
        server.start_agent(SESSION)
        assert server.run_as("overview", SESSION).exit_code == 0
        for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {HOOK_REQUEST_LOG_SETTING} true --project", f"setting set {HOOK_DURATIONS_SETTING} true --project"):
            server.expect_cli_exit(line, "/", 0, "")
        path = journal.home.system_log
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.write(path.with_name("server.log.1"), "2026-01-01T10:00:00+00:00 info server older server line\n")
        FileAccess.write(path, "2026-01-01T11:00:00+00:00 warning server server warning\nserver output\n")
        journal.container.get(ErrorLog).reported(["sample"], RuntimeError("sample failure"))
        journal.container.get(SystemLogWriter).write(LogLevel.INFORMATION, "stop allowed: no open task")
        yield server


def read_logs(server, *flags):
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    return server.viewer_line_value(cookie, {"line": ["developer", "system-logs", *flags], "environment": "main", "window": "developer.system-logs"})


def test_system_logs_read_existing_files_and_notes_through_the_viewer_route(logs_server):
    lines = read_logs(logs_server)["rows"]
    assert {line["source"] for line in lines} == {"server", "journal"}
    assert any(line["text"] == "stop allowed: no open task" and line["level"] == "info" for line in lines)
    assert any(line["text"] == "RuntimeError: sample failure" and line["level"] == "error" for line in lines)
    assert [line["recorded_at"] for line in lines] == sorted((line["recorded_at"] for line in lines), reverse=True)
    assert lines[-1]["text"] == "older server line"


def test_system_logs_filter_before_paging_and_show_raw_output_as_a_server_warning(logs_server):
    first = read_logs(logs_server, "--source", "server", "--level", "warning", "--limit", "1")
    second = read_logs(logs_server, "--source", "server", "--level", "warning", "--limit", "1", "--page", "2")
    assert (first["total"], first["size"], second["page"]) == (2, 1, 2)
    assert first["rows"][0]["text"] == "server output" and second["rows"][0]["text"] == "server warning"
    assert read_logs(logs_server, "--source", "bypass")["rows"] == []


def test_system_logs_read_an_empty_home_without_creating_files(logs_server):
    path = logs_server.journal.home.system_log
    for log in (path, path.with_name("server.log.1")):
        log.unlink(missing_ok=True)
    value = read_logs(logs_server)
    assert value["rows"] == [] and value["total"] == 0 and not path.exists()


def test_system_logs_keep_unstructured_lines_and_invalid_bytes(logs_server):
    FileAccess.write_binary(logs_server.journal.home.system_log, b"raw server output\n2026-99-99T11:00:00+00:00 invalid date\ninvalid byte: \xff\n")
    lines = read_logs(logs_server, "--source", "server")["rows"]
    assert [line["text"] for line in lines[:3]] == ["invalid byte: �", "2026-99-99T11:00:00+00:00 invalid date", "raw server output"]


def test_each_writer_shows_on_the_page_with_its_source_and_level(logs_server, monkeypatch):
    def refused_append(entries):
        raise PermissionError("journal folder is read-only")

    def refused_copy():
        raise PermissionError("read-only profile folder")

    server = logs_server
    home = server.journal.home
    server.expect_hook_answer("/hook", finished_edit("slow-edit"), 200, '"refusal":')
    ServerFiles(home).log_line("sample server line")
    request_trace = RequestTrace(home, SYSTEM_CLOCK)
    request_trace.configuration = RequestTraceSettings(True, 10)
    monkeypatch.setattr(request_trace.trace_file, "append", refused_append)
    request_trace.record(["task", "list"], "cli", 1.0, 0.0, 0)
    request_trace.complete_reads(1, ())
    move = server.journal.container.get(ProfileFolderMove)
    monkeypatch.setattr(move, "run", refused_copy)
    move.publish()
    FileAccess.write(home.bypass_log, "1700000000 hook claude\n2026-11-06T10:00:00Z the server did not answer, so process 7 ran as it is: ls\n")
    server.expect_hook_answer("/hook", finished_edit("second-edit"), 200, '"refusal":')
    cursors = server.journal.container.get(ListenerCursorTable)
    assert PolledWait(10, 0.05).poll(lambda: not cursors.has_unhandled_events()), "the listeners never caught up"
    lines = read_logs(server, "--limit", "200")["rows"]
    texts = ("RuntimeError: sample failure", "journal sample", "stop allowed: no open task", "sample server line",
             "request recording failed: journal folder is read-only", "read receipt recording failed: journal folder is read-only",
             "Profiles left unchanged", "1700000000 hook claude", "process 7 ran as it is: ls")
    shown = {text: next(((line["source"], line["level"]) for line in lines if text in line["text"]), None) for text in texts}
    assert shown == {
        "RuntimeError: sample failure": ("journal", "error"),
        "journal sample": ("journal", "error"),
        "stop allowed: no open task": ("journal", "info"),
        "sample server line": ("server", "info"),
        "request recording failed: journal folder is read-only": ("server", "warning"),
        "read receipt recording failed: journal folder is read-only": ("server", "warning"),
        "Profiles left unchanged": ("journal", "warning"),
        "1700000000 hook claude": ("bypass", "warning"),
        "process 7 ran as it is: ls": ("bypass", "warning"),
    }, shown


def test_system_logs_navigation_depends_on_developer_tools_and_not_request_recording(logs_server):
    cookie = logs_server.expect_viewer_login(logs_server.viewer_key("Ada"))
    for tools, recording, visible in (("on", "false", True), ("off", "true", False)):
        for line in (["setting", "switch", TOOLS_SETTING, tools, "--project"], ["setting", "set", HOOK_REQUEST_LOG_SETTING, recording, "--project"]):
            logs_server.viewer_line_value(cookie, {"line": line, "environment": "main", "window": "settings.settings"})
        status, body, _ = logs_server.viewer_download("/api/windows?environment=main", cookie)
        assert status == 200 and any(window["name"] == "developer.system-logs" for window in json.loads(body)["windows"]) is visible


def test_system_log_key_filters_before_paging_and_reloads_only_logs(logs_server):
    server = logs_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    query = "environment=main&logs.source=server&logs.level=warning&logs.limit=1"
    status, answer = server.window_data(cookie, window="developer.system-logs", query=query)
    page = answer["keys"]["logs"]["value"]
    assert status == 200 and set(answer["keys"]) == {"logs"} and len(page["rows"]) == 1 and page["total"] >= 2, answer
    assert all(row["source"] == "server" and row["level"] == "warning" for row in page["rows"])
    status, older = server.window_data(cookie, keys="logs", window="developer.system-logs", query=f"{query}&logs.page=2")
    older_rows = older["keys"]["logs"]["value"]["rows"]
    assert status == 200 and set(older["keys"]) == {"logs"} and len(older_rows) == 1 and older_rows[0]["id"] != page["rows"][0]["id"], older
