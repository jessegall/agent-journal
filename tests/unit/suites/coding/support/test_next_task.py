from types import SimpleNamespace

import pytest

from suites.coding.support.next_task import NextTask

NORMAL, CRITICAL = 100, 400


def task(task_id, priority=NORMAL):
    return SimpleNamespace(id=task_id, priority=priority)


def assigner(selected_task=None, open_task=None, focused=None, planned=None, reserved=()):
    tasks = SimpleNamespace(next_open=lambda excluded_id, exclusion: open_task, assigned_ready=lambda agent_id: reserved)
    plan_tasks = SimpleNamespace(plan_exclusion=lambda: None)
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(find=lambda agent_id: SimpleNamespace(id=agent_id)))
    plan_order = SimpleNamespace(first_started_plan_task=lambda tasks: tasks[0] if tasks else None)
    choices = SimpleNamespace(find=lambda agent_id, excluded_id: selected_task)
    picker = SimpleNamespace(first_started=lambda agent, excluded_id: focused or planned)
    return NextTask(tasks, plan_tasks, queries, SimpleNamespace(), SimpleNamespace(), plan_order, choices, picker)


@pytest.mark.parametrize("steps, first_id", [
    (dict(selected_task=task(1), open_task=task(2, CRITICAL), focused=task(3), planned=task(4), reserved=tuple([task(5)])), 1),
    (dict(open_task=task(2, CRITICAL), focused=task(3), planned=task(4), reserved=tuple([task(5)])), 2),
    (dict(open_task=task(2), focused=task(3), planned=task(4), reserved=tuple([task(5)])), 3),
    (dict(open_task=task(2), planned=task(4), reserved=tuple([task(5)])), 4),
    (dict(open_task=task(2), reserved=tuple([task(5)])), 2),
    (dict(reserved=tuple([task(5)])), 5),
], ids=["the selected_task task", "a critical task outside any plan", "the focus", "the oldest started plan", "an open task outside any plan", "a reserved task last"])
def test_each_step_of_the_order_is_taken_when_the_steps_before_it_give_nothing(steps, first_id):
    assert assigner(**steps).following(7).id == first_id


def test_empty_hands_and_nothing_anywhere_give_nothing():
    assert assigner().following(7) is None
