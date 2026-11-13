from types import SimpleNamespace

import pytest

from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask

WORKER_ID = 8


def task(task_id):
    return SimpleNamespace(id=task_id)


READY = (task(1), task(2), task(3))


def next_task(selected=None, focused=None, ready=READY, waiting_ids=()):
    tasks = SimpleNamespace(assigned_ready=lambda worker_id: ready, started_tasks=lambda worker_id: ())
    plan_order = SimpleNamespace(first_placed=lambda tasks: tasks[0] if tasks else None)
    open_tasks = SimpleNamespace(startable_tasks=lambda worker_id, ready, started_count: tuple(task for task in ready if task.id not in waiting_ids))
    choices = SimpleNamespace(find=lambda worker_id: selected)
    picker = SimpleNamespace(first=lambda agent: focused)
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(find=lambda agent_id: SimpleNamespace(id=agent_id)))
    return WorkerNextTask(tasks, plan_order, choices, picker, queries, open_tasks)


@pytest.mark.parametrize("selected, focused, first_id", [
    (task(3), task(2), 3),
    (None, task(2), 2),
    (None, None, 1),
    (None, task(9), 1),
], ids=["the chosen task first", "then the task of the focus", "then the order of the plans", "a task of the focus that is not the worker's is never taken"])
def test_the_guidance_and_the_next_task_name_the_same_task(selected, focused, first_id):
    picker = next_task(selected, focused)
    assert picker.following(WORKER_ID).id == first_id
    assert picker.first_ready(WORKER_ID, READY, ()).id == first_id


def test_a_worker_with_one_ready_task_takes_it_without_a_read_of_its_focus():
    assert next_task(focused=task(9), ready=tuple([task(1)])).following(WORKER_ID).id == 1


def test_a_task_the_worker_may_not_start_now_is_passed_over_also_when_the_focus_names_it():
    assert next_task(focused=task(1), waiting_ids=(1, 2)).following(WORKER_ID).id == 3


def test_a_worker_with_nothing_ready_takes_nothing():
    assert next_task(ready=()).following(WORKER_ID) is None
