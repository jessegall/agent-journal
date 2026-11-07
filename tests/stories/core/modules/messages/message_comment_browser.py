from tests.stories.core.modules.messages.message_comments import story_with_peer_message
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_comment_shows_one_comment_card_while_sending_and_after_it_is_saved(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser(server, "messageComment.browser.mjs", [str(tmp_path / "message-comment.png")])
