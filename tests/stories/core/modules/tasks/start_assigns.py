import pytest

from tests.stories.core.modules.tasks.support.holder_assignee_check import assert_holders_are_assignees, rows, task_assignees
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.holder_fixtures import FreeThirdTask, dispatched

FREE_TASK = 3


@pytest.fixture
def free_task(new_story):
    story = new_story(fixture=FreeThirdTask)
    story.worker = dispatched(story)
    return story


def assignment_ids(story) -> list[int]:
    return [assignment["id"] for assignment in rows(story, "assignment list") if assignment["subject_model"] == "task" and assignment["subject_id"] == FREE_TASK]


def test_a_worker_that_starts_an_unassigned_task_becomes_its_assignee(free_task):
    free_task.expect_success(f"task start {FREE_TASK}", actor=free_task.worker)
    assert_holders_are_assignees(free_task)
    free_task.expect_rows(task_assignees(free_task).get(FREE_TASK) == [free_task.worker.id], detail=str(task_assignees(free_task)))


def test_a_person_that_starts_an_unassigned_task_becomes_its_assignee(free_task):
    free_task.expect_success(f"task start {FREE_TASK} --environment main", actor=free_task.user)
    assert_holders_are_assignees(free_task)
    free_task.expect_rows(task_assignees(free_task).get(FREE_TASK) == [free_task.user.id], detail=str(task_assignees(free_task)))


def test_starting_a_task_already_assigned_to_the_starter_changes_no_assignment(free_task):
    free_task.expect_success(f"assign task {FREE_TASK} --to {free_task.user.id} --environment main", actor=free_task.user)
    assert_holders_are_assignees(free_task)
    assigned = assignment_ids(free_task)
    free_task.expect_success(f"task start {FREE_TASK} --environment main", actor=free_task.user)
    assert_holders_are_assignees(free_task)
    free_task.expect_rows(assignment_ids(free_task) == assigned, len(assigned) == 1, detail=str(task_assignees(free_task)))


def test_a_person_may_start_a_task_assigned_to_someone_else_and_the_assignment_does_not_move(free_task):
    free_task.expect_success(f"task assign {FREE_TASK} --to {agent_number(free_task, free_task.worker.id)}", actor=free_task.agent)
    assert_holders_are_assignees(free_task)
    free_task.expect_success(f"task start {FREE_TASK} --environment main", actor=free_task.user)
    assert_holders_are_assignees(free_task)
    free_task.expect_rows(task_assignees(free_task).get(FREE_TASK) == [free_task.worker.id], detail=str(task_assignees(free_task)))
    free_task.expect_text(f"task show {FREE_TASK}", "state: started", f"holder_id: {free_task.user.id}", actor=free_task.agent)
