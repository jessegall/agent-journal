from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_new_plan_shows_phases_and_tasks_as_they_are_added(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        expect_browser(server, "planDock.browser.mjs", [str(server.socket_path)])
