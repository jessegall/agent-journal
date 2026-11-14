from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_memory_is_weighed_removed_and_brought_back_with_undo_on_the_memories_page(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success('memory make "Totals are in cents" --weight 5 --environment main', actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "memories.browser.mjs", [])
