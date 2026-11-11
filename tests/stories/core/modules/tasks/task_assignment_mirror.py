import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.tasks.support.holder_assignee_check import assert_holders_are_assignees, assert_pivot_equals_column, task_assignees
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


def expect_equal_everywhere(story) -> None:
    assert_pivot_equals_column(story)
    assert_holders_are_assignees(story)


@pytest.fixture
def delegated(new_story):
    """Tasks 1 and 2 are sent to one worker, which starts task 1; a third task is open and nobody's."""
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    story.run('task make "Third job" --brief "Do the third job" --environment main', actor=story.agent)
    return story


def test_task_assign_is_mirrored_to_the_pivot_and_a_task_has_one_assignee_at_a_time(delegated):
    delegated.expect_success(f"task assign 3 --to {agent_number(delegated, delegated.worker.id)}", actor=delegated.agent)
    expect_equal_everywhere(delegated)
    delegated.expect_rows(task_assignees(delegated).get(3) == [delegated.worker.id], detail=str(task_assignees(delegated)))
    delegated.expect_success(f"task assign 3 --to {agent_number(delegated, delegated.agent.id)}", actor=delegated.agent)
    expect_equal_everywhere(delegated)
    delegated.expect_rows(task_assignees(delegated).get(3) == [delegated.agent.id], detail=str(task_assignees(delegated)))


def test_a_worker_start_of_a_free_task_is_mirrored(delegated):
    delegated.expect_success("task start 3", actor=delegated.agent)
    expect_equal_everywhere(delegated)
    delegated.expect_rows(task_assignees(delegated).get(3) == [delegated.agent.id], detail=str(task_assignees(delegated)))


def test_a_release_of_a_worker_is_mirrored_so_waiting_tasks_have_no_row(delegated):
    expect_equal_everywhere(delegated)
    delegated.expect_success(f'worker release {agent_number(delegated, delegated.worker.id)} "not needed"', actor=delegated.agent)
    expect_equal_everywhere(delegated)
    delegated.expect_text("task info 2", "assigned to: nobody", actor=delegated.agent)
    delegated.expect_rows(2 not in task_assignees(delegated), detail=str(task_assignees(delegated)))


def test_a_cancelled_delegated_task_stays_equal_in_column_and_pivot(delegated):
    delegated.expect_success('task cancel 2 --reason "not needed"', actor=delegated.agent)
    expect_equal_everywhere(delegated)
    delegated.expect_success(f'worker release {agent_number(delegated, delegated.worker.id)} "not needed"', actor=delegated.agent)
    expect_equal_everywhere(delegated)


def test_a_task_assigned_to_a_person_is_mirrored(delegated):
    person = Actor(delegated.new_row_id('actor make user "Ada"'), ActorType.USER)
    outcome = delegated.run(f"assign task 3 --to {person.id} --environment main", actor=person)
    delegated.expect_success('task edit 3 --priority high --environment main', actor=delegated.agent)
    delegated.expect_rows(outcome.code == 0, task_assignees(delegated).get(3) == [person.id], detail=outcome.output_text)
