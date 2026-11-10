import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.tasks.migrations.m017_block_waiting_tasks import BlockWaitingTasksMigration
from tests.stories.core.support.coding_fixtures import UserBuilder
from engine.testing.stories.story_fixture import StoryFixture


class WaitingTask(StoryFixture):
    """Task 1 waits on task 2."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success('task make "Waiting"', actor=story.agent)
        story.expect_success('task make "Needed"', actor=story.agent)
        story.expect_success("task depend 1 --on 2", actor=story.agent)


def read_state(story, task_id: int) -> str:
    return next(line.removeprefix("state: ") for line in story.run(f"task show {task_id}", actor=story.agent).output_text.splitlines() if line.startswith("state: "))


def test_a_task_that_waits_on_an_open_task_is_blocked(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_rows(read_state(story, 1) == "blocked", read_state(story, 2) == "open")
    story.expect_text("task show 1", "reason: waits on task 2", actor=story.agent)
    story.expect_refusal("task start 1", "task 1", actor=story.agent)


def test_it_opens_when_the_task_it_waits_on_completes(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_success("task start 2", actor=story.agent)
    story.expect_success('task close 2 --outcome "Done"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "started")


def test_it_opens_when_the_task_it_waits_on_is_removed(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_success("task delete 2", actor=story.user)
    story.expect_rows(read_state(story, 1) == "open")


def test_it_opens_when_the_dependency_is_removed(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_success("task remove-dependency 1 --on 2", actor=story.agent)
    story.expect_rows(read_state(story, 1) == "open")


def test_a_reopened_task_blocks_what_waits_on_it_again(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_success('task cancel 2 --reason "Not needed"', actor=story.agent)
    story.expect_success("task reopen 2", actor=story.user)
    story.expect_rows(read_state(story, 1) == "blocked")


def test_a_started_task_keeps_running_when_a_dependency_is_added(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('task make "Running"', actor=story.agent)
    story.expect_success('task make "Later"', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_success("task depend 1 --on 2", actor=story.agent)
    story.expect_rows(read_state(story, 1) == "started")


def test_the_migration_blocks_each_open_task_that_waits_on_an_open_task(new_story):
    story = new_story(fixture=WaitingTask)
    database = story.container.get(Database)
    database.update(Statement("DELETE FROM task_waits"))
    database.update(Statement("UPDATE tasks SET state = 'open', reason = '' WHERE id = 1"))
    for statement in BlockWaitingTasksMigration.statements:
        database.update(Statement(statement))
    story.expect_rows(read_state(story, 1) == "blocked")
    story.expect_success('task cancel 2 --reason "Not needed"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "open")


class ThreeWaiting(StoryFixture):
    """Task 1 waits on tasks 2, 3 and 4."""

    parent = WaitingTask

    def steps(self, story):
        story.expect_success('task make "Also needed"', actor=story.agent)
        story.expect_success('task make "And this"', actor=story.agent)
        story.expect_success("task depend 1 --on 3", actor=story.agent)
        story.expect_success("task depend 1 --on 4", actor=story.agent)


@pytest.mark.parametrize("order", [(3, 2, 4), (4, 3, 2)])
def test_three_waits_ending_in_another_order_open_it_only_after_the_last(new_story, order):
    story = new_story(fixture=ThreeWaiting)
    for task_id in order[:-1]:
        story.expect_success(f'task cancel {task_id} --reason "Not needed"', actor=story.agent)
        story.expect_rows(read_state(story, 1) == "blocked")
    story.expect_success(f'task cancel {order[-1]} --reason "Not needed"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "open")


def test_three_waits_ending_in_three_ways_open_it_after_the_last(new_story):
    story = new_story(fixture=ThreeWaiting)
    story.expect_success("task remove-dependency 1 --on 4", actor=story.agent)
    story.expect_rows(read_state(story, 1) == "blocked")
    story.expect_success("task delete 3", actor=story.user)
    story.expect_rows(read_state(story, 1) == "blocked")
    story.expect_success('task cancel 2 --reason "Not needed"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "open")


def test_a_wait_on_a_question_holds_the_task_after_its_tasks_end(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_text('question ask "Which colour?" --context "The button needs one." --options "The agent picks red" "The agent picks blue"', "question 1 asked", actor=story.agent)
    story.expect_success("task block 1 --on question:1", actor=story.agent)
    story.expect_success('task cancel 2 --reason "Not needed"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "blocked")
    story.expect_success('question answer 1 --answer "The agent picks red"', actor=story.user)
    story.expect_rows(read_state(story, 1) == "open")


def test_a_chain_opens_one_task_at_a_time(new_story):
    story = new_story(fixture=WaitingTask)
    story.expect_success('task make "Before that"', actor=story.agent)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    story.expect_rows(read_state(story, 1) == "blocked", read_state(story, 2) == "blocked")
    story.expect_success('task cancel 3 --reason "Not needed"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "blocked", read_state(story, 2) == "open")
    story.expect_success('task cancel 2 --reason "Not needed"', actor=story.agent)
    story.expect_rows(read_state(story, 1) == "open")
