from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_returning_to_a_chat_shows_only_the_newest_page_at_its_bottom(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project")
    for number in range(1, 121):
        story.expect_success(f'message send "Backlog message {number}" --environment main')
    with server_story(story) as server:
        expect_browser(server, "chatReturn.browser.mjs", ["/tmp/journal-worker-464-chat-return.png"])
