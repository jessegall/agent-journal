from types import SimpleNamespace

import pytest

from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.focus.unblocker import Unblocker
from core.modules.plans.support.focus.unblockers import Unblockers

NORMAL, HIGH = 100, 200


def task(task_id, priority=NORMAL):
    return SimpleNamespace(id=task_id, priority=priority)


def work(places=(), unlocks=()):
    ready_places = tuple(SimpleNamespace(task_id=task_id, position=position) for task_id, position in places)
    return PlanWork(SimpleNamespace(id=1), ready_places, Unblockers(tuple(Unblocker(task_id, count) for task_id, count in unlocks)))


@pytest.mark.parametrize("places, unlocks, tasks, first_id", [
    ([(1, 1), (2, 2)], [(2, 3)], [task(1, HIGH), task(2)], 2),
    ([(1, 1), (2, 2)], [(1, 1), (2, 1)], [task(1), task(2, HIGH)], 2),
    ([(2, 1)], [(2, 1), (9, 1)], [task(2), task(9)], 2),
    ([(1, 2), (2, 1)], [], [task(1), task(2)], 2),
    ([(4, 1), (3, 1)], [], [task(4), task(3)], 3),
    ([(1, 1)], [(9, 1)], [task(1, HIGH), task(9)], 9),
], ids=["the most waiting tasks first", "then the highest priority", "then a task of the plan before a task outside it",
        "then the place in the phase", "then the lowest number", "a task outside the plan that unlocks more goes before a ready plan task"])
def test_the_task_to_take_first_follows_one_ranking(places, unlocks, tasks, first_id):
    assert work(places, unlocks).first(tasks).id == first_id


def test_no_task_gives_nothing_and_the_task_numbers_are_the_ready_places_and_the_unblockers_once():
    plan_work = work([(2, 1), (1, 2)], [(2, 1), (9, 2)])
    assert plan_work.first([]) is None
    assert plan_work.task_ids() == (1, 2, 9)
