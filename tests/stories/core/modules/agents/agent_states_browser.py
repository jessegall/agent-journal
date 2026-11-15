from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_open_agent_inspector_shows_the_states_the_agent_is_in_with_their_state_types(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    with server_story(story) as server:
        expect_browser(server, "agentStates.browser.mjs", [str(story.agent.id), "tasks.main-agent"])
