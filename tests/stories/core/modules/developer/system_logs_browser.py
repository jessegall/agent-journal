from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.file.file_access import FileAccess
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_system_logs_page_in_a_real_browser(new_story):
    story = new_story(fixture=HookRecordingEnabled)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        path = story.home.system_log
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.write(path, "".join(f"2026-01-01T10:00:00+00:00 info server browser server line {number}\n" for number in range(75)))
        story.container.get(SystemLogWriter).write(LogLevel.INFORMATION, "browser journal note")
        expect_browser(server, "systemLogs.browser.mjs", [])
