from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_sequence_made_in_the_dialog_shows_its_steps_and_its_runs_tab(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success("sequence list", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "sequences.browser.mjs", [])
