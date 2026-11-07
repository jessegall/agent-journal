from tests.stories.core.modules.messages.message_comments import story_with_peer_message
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_composer_grows_upward_one_line_at_a_time_from_the_third_line_and_shrinks_back(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser(server, "composerHeight.browser.mjs", [])
