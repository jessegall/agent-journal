from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.core.support import story_lines as lines
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def test_a_task_is_shown_whole(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --brief "the total is wrong" --priority high --environment main')
    story.expect_success(lines.TASK_DETAILS, "title: Fix the cart", "brief: the total is wrong", "priority: high", "creator_id: 1")


def test_tasks_are_listed_newest_first_a_page_at_a_time_and_by_state(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.expect_success("task list --limit 2", "3  Third  open  normal", f"2  {story.agent.id}  Second  started  normal", "page 1, 2 of 3 rows: --page 2 for the next")
    story.expect_success("task list --limit 2 --page 2", "1  First  open  normal")
    story.expect_success("task list --state started", f"2  {story.agent.id}  Second  started  normal")


def test_an_edit_changes_only_the_fields_named(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --brief "the total is wrong" --environment main')
    story.expect_success('task edit 1 --title "Fix the cart total"', "title: Fix the cart total", "brief: the total is wrong", "version: 2")


def test_a_task_is_deleted_only_while_open_or_cancelled(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.expect_success(lines.TASK_DELETION, "the task is deleted")
    story.expect_refusal("task delete 2", "started")
