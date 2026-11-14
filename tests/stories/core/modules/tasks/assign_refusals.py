import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType

from tests.stories.core.modules.tasks.support.holder_assignee_check import assert_holders_are_assignees, task_assignees
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.holder_fixtures import free_third_task

FREE_TASK = 3
WAITING_TASK = 2


@pytest.fixture
def free_task(new_story):
    return free_third_task(new_story)


def worker_label(story) -> str:
    return f"worker {agent_number(story, story.worker.id)}"


def test_a_worker_that_runs_task_assign_is_refused_only_a_person_or_the_main_agent_assigns(free_task):
    free_task.expect_refusal(f"task assign {FREE_TASK} --to {agent_number(free_task, free_task.worker.id)}", "a worker cannot assign a task", actor=free_task.worker)
    free_task.expect_rows(FREE_TASK not in task_assignees(free_task), detail=str(task_assignees(free_task)))


def test_a_helper_that_runs_journal_assign_is_refused(free_task):
    helper = Actor(free_task.new_row_id(f"agent start sub-1 claude helper --parent {free_task.agent.id} --environment main"), ActorType.AGENT)
    free_task.expect_refusal(f"assign task {FREE_TASK} --to {helper.id}", "cannot assign a row", actor=helper)
    free_task.expect_rows(FREE_TASK not in task_assignees(free_task), detail=str(task_assignees(free_task)))


def test_the_main_agent_may_run_task_assign(free_task):
    free_task.expect_success(f"task assign {FREE_TASK} --to {agent_number(free_task, free_task.worker.id)}", actor=free_task.agent)
    assert_holders_are_assignees(free_task)
    free_task.expect_text(f"task info {FREE_TASK}", f"assigned to: agent {free_task.worker.id}", actor=free_task.agent)


def test_an_agent_that_starts_a_task_assigned_to_the_main_agent_is_refused(free_task):
    free_task.expect_success(f"task assign {FREE_TASK} --to {agent_number(free_task, free_task.agent.id)}", actor=free_task.agent)
    free_task.expect_refusal(f"task start {FREE_TASK}", f"task {FREE_TASK} is assigned to main agent", actor=free_task.worker)
    assert_holders_are_assignees(free_task)
    free_task.expect_text(f"task show {FREE_TASK}", "state: open", actor=free_task.agent)


def test_an_agent_that_starts_a_task_assigned_to_another_worker_is_refused(free_task):
    free_task.expect_success(f"task assign {FREE_TASK} --to {agent_number(free_task, free_task.worker.id)}", actor=free_task.agent)
    free_task.expect_refusal(f"task start {FREE_TASK}", f"task {FREE_TASK} is assigned to {worker_label(free_task)}", actor=free_task.agent)
    assert_holders_are_assignees(free_task)


def test_a_task_assigned_to_a_person_started_by_an_agent_is_refused(free_task):
    free_task.expect_success(f"assign task {FREE_TASK} --to {free_task.user.id} --environment main", actor=free_task.user)
    free_task.expect_refusal(f"task start {FREE_TASK}", f"task {FREE_TASK} is assigned to Ada", actor=free_task.agent)
    assert_holders_are_assignees(free_task)


def test_a_task_assigned_to_worker_w_and_not_started_is_not_taken_by_another_actors_start(free_task):
    free_task.expect_refusal(f"task start {WAITING_TASK}", f"task {WAITING_TASK} is assigned to {worker_label(free_task)}", actor=free_task.agent)
    assert_holders_are_assignees(free_task)
    free_task.expect_text(f"task show {WAITING_TASK}", "state: open", actor=free_task.agent)
    free_task.expect_rows(task_assignees(free_task).get(WAITING_TASK) == [free_task.worker.id], detail=str(task_assignees(free_task)))
