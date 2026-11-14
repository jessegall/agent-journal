import json

from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.server_client import server_story
from tests.integration.support.server_harness import viewer_answer


def test_with_the_request_log_on_and_the_database_busy_trace_rows_are_kept_for_the_tick(new_story):
    with server_story(new_story(fixture=HookRecordingEnabled), listener_thread_started=False) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        with server.story.busy_database():
            server.viewer_line_value(cookie, {"window": "tasks.tasks", "environment": "main", "line": ["task", "list"]})
        status_code, _, text = viewer_answer(server.viewer_port(), "/api/request-log-status", cookie, "")
        status = json.loads(text)
        server.story.expect_rows(status_code == 200, status["recorded"] >= 1, status["dropped"] == 0, detail=text)
        server.story.run_tick("request trace import")
        server.story.run_tick("request trace import")
        server.story.expect_text("developer hook-requests", "task list", actor=server.story.user)
