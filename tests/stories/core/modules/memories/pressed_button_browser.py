from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

CAPTURE = "/tmp/pressed-button"


def test_a_button_shows_a_spinner_and_sends_one_request_on_a_double_click(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('memory make "Close each task with its outcome" --weight 4 --environment main', actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "pressedButton.browser.mjs", [CAPTURE])
