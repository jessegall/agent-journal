import json

from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.core.support import story_lines as lines
from tests.stories.core.modules.tasks.task_lifecycle import started_story
from engine.testing.expectations.expect_row import expect_row


def test_a_task_is_shown_whole(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --brief "the total is wrong" --priority high --environment main')
    story.expect_success(lines.TASK_DETAILS, "title: Fix the cart", "brief: the total is wrong", "priority: high", "creator_id: 1")


def test_tasks_are_listed_newest_first_a_page_at_a_time_and_by_state(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.expect_success("task list --limit 2", "3  Third  open  normal", f"2  {story.agent.id}  Second  started  normal  2026-10-31T09:00:00.000000+00:00  {story.agent.id}", "page 1, 2 of 3 rows: --page 2 for the next")
    story.expect_success("task list --limit 2 --page 2", "1  First  open  normal")
    story.expect_success("task list --state started", f"2  {story.agent.id}  Second  started  normal  2026-10-31T09:00:00.000000+00:00  {story.agent.id}")


def test_an_edit_changes_only_the_fields_named(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --brief "the total is wrong" --environment main')
    story.expect_success('task edit 1 --title "Fix the cart total"', "title: Fix the cart total", "brief: the total is wrong", "version: 2")


def test_a_task_is_deleted_only_while_open_or_cancelled(new_story):
    story = new_story(fixture=ThreeTasks)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.expect_text(lines.TASK_DELETION, "task:1")
    story.expect_refusal("task delete 2", "started")


def test_a_priority_is_a_number_given_by_name_or_number_and_a_level_reads_by_its_name(new_story):
    story = started_story(new_story)
    story.run('task make "Fire" --priority critical --environment main')
    story.expect_success("task show 1", "priority: critical")
    story.expect_success("task edit 1 --priority 250", "priority: 250")
    story.expect_success("task edit 1 --priority high", "priority: high")
    expect_row(json.loads(story.run("task inspect 1 --json", actor=story.user).output_text), priority=300)
