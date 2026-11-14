from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_file_of_the_feed_opens_in_the_file_inspector_and_the_inspector_opens_the_files_page(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1).with_fields(event="post_tool_use"))
    story.expect_text("file-edit list", "src/cart.py", actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "files.browser.mjs", [str(story.agent.id)])
