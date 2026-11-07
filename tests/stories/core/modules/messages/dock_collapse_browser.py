from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_docks_collapse_when_chat_is_scrolled_up(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    for number in range(1, 31):
        story.expect_success(f'message send "Scroll message {number}" --environment main')
    with server_story(story) as server:
        expect_browser(server, "dockCollapse.browser.mjs", [str(tmp_path / "dock-collapse")])
