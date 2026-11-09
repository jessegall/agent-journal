from tests.stories.core.modules.messages.peer_messages import ENVELOPE, hook_with, queued, transcript_with
from tests.stories.core.support.coding_fixtures import UserBuilder


def story_with_peer_message(new_story, tmp_path):
    story = new_story(fixture=UserBuilder)
    hook_with(story, transcript_with(tmp_path, queued(ENVELOPE)))
    return story


def test_a_comment_on_a_message_between_agents_reaches_the_agent_naming_the_message(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.expect_text('message comment 2 "Check the cart too" --environment main', "comment written as message", actor=story.user)
    story.expect_text("message unread --environment main","Check the cart too", actor=story.agent)


def test_a_comment_on_a_message_is_a_comment_in_the_feed_that_names_the_message(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.run('message comment 2 "Check the cart too" --environment main', actor=story.user)
    story.expect_text("message feed --json", '"commented_row": "message:2"', actor=story.user)


def test_a_comment_on_a_message_leaves_the_message_unchanged(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.run('message comment 2 "Check the cart too" --environment main', actor=story.user)
    story.expect_text("message show 2", "Check 138 failed", actor=story.user)


def test_a_comment_on_a_message_that_does_not_exist_is_refused(new_story, tmp_path):
    story = story_with_peer_message(new_story, tmp_path)
    story.expect_refusal('message comment 99 "Hello" --environment main', "99", actor=story.user)
