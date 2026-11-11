import pytest

from core.modules.tasks.queries.task_query import TaskQuery
from tests.stories.core.modules.tasks.assigned_reads import TwoWorkersFourTasks, assign, assigned_ids, worker_v, worker_w


@pytest.fixture
def workshop(new_story):
    return new_story(fixture=TwoWorkersFourTasks)


def test_the_assigned_tasks_of_a_worker_are_read_again_after_a_task_moves_from_a_to_b(workshop):
    worker_a, worker_b = worker_w(workshop), worker_v(workshop)
    assign(workshop, 4, worker_a)
    assign(workshop, 3, worker_a)
    workshop.expect_rows(assigned_ids(workshop, worker_a) == [3, 4], assigned_ids(workshop, worker_b) == [], detail=str(assigned_ids(workshop, worker_a)))
    assign(workshop, 4, worker_b)
    workshop.expect_rows(assigned_ids(workshop, worker_a) == [3], assigned_ids(workshop, worker_b) == [4], detail=f"{assigned_ids(workshop, worker_a)} | {assigned_ids(workshop, worker_b)}")
    assign(workshop, 3, worker_b)
    assign(workshop, 4, worker_a)
    workshop.expect_rows(assigned_ids(workshop, worker_a) == [4], assigned_ids(workshop, worker_b) == [3], detail="one task each, swapped: the count is as before and the lists are still right")


def test_a_task_assigned_to_nobody_after_unassign_leaves_the_workers_list(workshop):
    worker_a = worker_w(workshop)
    assign(workshop, 2, worker_a)
    workshop.expect_rows(assigned_ids(workshop, worker_a) == [2], detail=str(assigned_ids(workshop, worker_a)))
    workshop.expect_success("unassign task 2 --environment main", actor=workshop.user)
    workshop.expect_rows(assigned_ids(workshop, worker_a) == [], detail=str(assigned_ids(workshop, worker_a)))


def test_a_second_read_with_no_change_does_not_reload(workshop):
    worker_a = worker_w(workshop)
    assign(workshop, 1, worker_a)
    tasks = workshop.container.get(TaskQuery)
    first_read = tasks.assigned(worker_a.id)
    workshop.expect_rows(tasks.assigned(worker_a.id) is first_read, detail="the second read returns the rows the first read loaded")
    workshop.expect_success('task make "Job 5" --brief "Do job 5" --environment main', actor=workshop.agent)
    workshop.expect_rows(tasks.assigned(worker_a.id) is first_read, detail="a new task of nobody changes nothing the worker is assigned")
