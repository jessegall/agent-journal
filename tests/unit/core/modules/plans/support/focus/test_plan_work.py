from types import SimpleNamespace

import pytest

from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.unblockers.unblocker import Unblocker
from core.modules.plans.support.unblockers.unblockers import Unblockers

NORMAL, HIGH = 100, 200


def place(task_id, position, priority=NORMAL):
    return SimpleNamespace(task_id=task_id, position=position, priority=priority)


def work(places=(), unblockers=()):
    return PlanWork(SimpleNamespace(id=1), tuple(places), Unblockers(tuple(unblockers)))


@pytest.mark.parametrize("places, unblockers, first_id", [
    ([place(1, 1, HIGH), place(2, 2)], [Unblocker(2, 3, NORMAL)], 2),
    ([place(1, 1), place(2, 2, HIGH)], [Unblocker(1, 1, NORMAL), Unblocker(2, 1, HIGH)], 2),
    ([place(2, 1)], [Unblocker(2, 1, NORMAL), Unblocker(9, 1, NORMAL)], 2),
    ([place(1, 2), place(2, 1)], [], 2),
    ([place(4, 1), place(3, 1)], [], 3),
    ([place(1, 1, HIGH)], [Unblocker(9, 1, NORMAL)], 9),
], ids=["the most waiting tasks first", "then the highest priority", "then a task of the plan before a task outside it",
        "then the place in the phase", "then the lowest number", "a task outside the plan that unlocks more goes before a ready plan task"])
def test_the_task_to_take_first_follows_one_ranking(places, unblockers, first_id):
    assert work(places, unblockers).first_task_id() == first_id


def test_a_task_just_released_is_passed_over_and_no_task_gives_nothing():
    assert work([place(1, 1), place(2, 2)]).first_task_id(1) == 2
    assert work().first_task_id() is None
