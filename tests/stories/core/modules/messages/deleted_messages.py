from tests.stories.core.support.coding_fixtures import BuilderWithUser


def deleted_message(story) -> int:
    message_id = story.new_row_id('message send "Never mind" --environment main', actor=story.user)
    story.expect_success(f"message delete {message_id}", actor=story.user)
    return message_id


def test_reading_a_message_the_user_deleted_says_so(new_story):
    story = new_story(fixture=BuilderWithUser)
    message_id = deleted_message(story)
    story.expect_refusal(f"message read {message_id}", f"the user deleted message {message_id}, so there is nothing to read", actor=story.agent)


def test_reading_a_number_that_never_was_a_message_stays_the_plain_refusal(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("message read 99999", "no message 99999", actor=story.agent)


def test_a_message_that_stands_is_read_as_before(new_story):
    story = new_story(fixture=BuilderWithUser)
    message_id = story.new_row_id('message send "Hello" --environment main', actor=story.user)
    story.expect_text(f"message read {message_id}", "Hello", actor=story.agent)
