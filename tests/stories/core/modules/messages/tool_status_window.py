from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.usage.tool_wait import BUILD, monitor_start
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import WINDOW, window_data

REFRESH_SECONDS = 5


def test_the_status_line_of_the_chat_shows_the_next_edit_after_a_wait_and_is_read_again_on_a_timer(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", monitor_start(BUILD))
    story.hook("s-1", HookSamples.stop())
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, keys="tool", window=WINDOW)
        shown = answer["keys"]["tool"]["value"]
        story.expect_rows(status == 200, shown["tool"].startswith("Edit"), shown["wait_target"] == "", answer["declared"]["tool"]["reload_seconds"] == REFRESH_SECONDS, detail=str(shown))
