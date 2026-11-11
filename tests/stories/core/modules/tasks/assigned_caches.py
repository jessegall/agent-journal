import pytest

from core.modules.tasks.queries.task_query import TaskQuery
from tests.stories.core.modules.tasks.assigned_reads import TwoWorkersFourTasks, assign, worker_w


@pytest.fixture
def workshop(new_story):
    return new_story(fixture=TwoWorkersFourTasks)


def test_a_second_read_with_no_change_does_not_reload(workshop):
    worker_a = worker_w(workshop)
    assign(workshop, 1, worker_a)
    tasks = workshop.container.get(TaskQuery)
    first_read = tasks.assigned(worker_a.id)
    workshop.expect_rows(tasks.assigned(worker_a.id) is first_read, detail="the second read returns the rows the first read loaded")
    workshop.expect_success('task make "Job 5" --brief "Do job 5" --environment main', actor=workshop.agent)
    workshop.expect_rows(tasks.assigned(worker_a.id) is first_read, detail="a new task of nobody changes nothing the worker is assigned")
