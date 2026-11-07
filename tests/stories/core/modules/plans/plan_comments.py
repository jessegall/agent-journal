from tests.stories.core.modules.tasks.task_lifecycle import started_story
from tests.stories.core.support import story_lines as lines


def test_a_comment_on_a_plan_is_a_message_linked_to_it(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.expect_text('plan comment 1 "Too big" --environment main', "comment written as message", actor=story.user)
    story.expect_text("plan comments 1", "Too big", actor=story.user)
    story.expect_refusal('plan comment 1 " " --environment main', "give the comment's text", actor=story.user)
