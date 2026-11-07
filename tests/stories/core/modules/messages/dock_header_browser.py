from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_dock_header_stays_at_the_top_of_the_dock_while_its_cards_scroll(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('setting set journal.core.viewer.tour-completed true --project')
    for number in range(1, 31):
        story.expect_success(f'message send "Scroll message {number}" --environment main')
    with server_story(story) as server:
        expect_browser(server, 'dockHeader.browser.mjs', [])
