import pytest

from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.enums.hook_answer import HookAnswer
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SIZE_SETTING


@pytest.fixture
def recording_server(played):
    with server_story(played(HookRecordingEnabled)) as server:
        yield server


def test_the_hook_requests_page_scrolls_and_shows_each_part_in_a_browser(recording_server):
    story = recording_server.story
    story.expect_success(f"setting set {HOOK_REQUEST_LOG_SIZE_SETTING} 100 --project", actor=story.user)
    log = story.container.get(HookRequestLog)
    for number in range(70):
        shell = {"parts": [{"text": "ls"}] * 3} if number == 69 else {}
        log.record("claude", {"X-Journal-Hook-Id": f"request-{number}"}, {"event": "pre_tool_use", "tool": {"name": "Bash", "shell": shell}, "text": "x" * 4000},
                   number * 20, HookAnswer.REFUSED if number == 69 else HookAnswer.ALLOWED)
    expect_browser(recording_server, "hookRequests.browser.mjs", [])


def test_a_poll_on_a_slow_route_has_one_request_in_flight_and_resumes_after_a_failed_one(recording_server):
    expect_browser(recording_server, "pollInFlight.browser.mjs", [])


