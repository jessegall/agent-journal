from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_right_click_on_a_chat_message_and_a_terminal_command_opens_their_menus_and_copies(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    story.expect_success('message send "Copy this message" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.shell("make check").with_fields(event="pre_tool_use"))
    with server_story(story) as server:
        expect_browser(server, "homeMenus.browser.mjs", [str(story.agent.id)])
