from tests.stories.core.modules.tasks.task_lifecycle import started_story
from tests.stories.core.support import story_lines as lines


def test_the_chat_feed_names_the_row_a_comment_is_on(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.expect_text('plan comment 1 "Too big" --environment main', "comment written as message", actor=story.user)
    story.expect_text("message feed --json", '"commented_row": "plan:1"', actor=story.user)


def test_a_plain_message_in_the_feed_names_no_row(new_story):
    story = started_story(new_story)
    story.run('message send "Hello" --environment main', actor=story.user)
    story.expect_text("message feed --json", '"commented_row": ""', actor=story.user)
