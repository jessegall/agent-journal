from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_the_chat_panes_tab_shows_its_cross_on_hover_and_closes_with_a_middle_click(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        expect_browser(server, "tabs.browser.mjs", [])
