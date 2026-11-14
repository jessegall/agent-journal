from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SETTING
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_developer_pages_follow_their_settings_in_the_sidebar(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
    story.expect_success(f"setting set {HOOK_DURATIONS_SETTING} false --project", actor=story.user)
    story.expect_success(f"setting set {HOOK_REQUEST_LOG_SETTING} false --project", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "developerPages.browser.mjs", [])
