from dataclasses import dataclass

from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks


@dataclass(frozen=True)
class NamedTask:
    """A task as the names read it: its number."""

    id: int


def test_a_short_list_names_every_task():
    assert WorkerUnfinishedTasks.names((NamedTask(1), NamedTask(2))) == "task:1, task:2"


def test_a_long_list_names_its_first_tasks_and_a_count_so_no_line_is_cut():
    names = WorkerUnfinishedTasks.names(tuple(NamedTask(number) for number in range(8830, 8838)))
    assert names == "task:8830, task:8831, task:8832 and 5 more tasks"
    assert len(f"worker:770 is stopped and nothing will start it: its process ended, {names}") <= 120


def test_one_task_past_the_first_is_named_in_the_singular():
    assert WorkerUnfinishedTasks.names(tuple(NamedTask(number) for number in range(1, 5))) == "task:1, task:2, task:3 and 1 more task"
