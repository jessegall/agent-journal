import pytest

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


@pytest.mark.parametrize('attempt', range(10))
def test_a_new_dock_keeps_the_chat_at_the_readers_position(new_story, attempt):
    story = new_story(fixture=UserJoined)
    story.expect_success('setting set journal.core.viewer.tour-completed true --project')
    for number in range(1, 31):
        story.expect_success(f'message send "Scroll message {number}" --environment main')
    with server_story(story) as server:
        expect_browser(server, 'dockScroll.browser.mjs', [])
