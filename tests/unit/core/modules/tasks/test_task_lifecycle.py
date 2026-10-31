from datetime import datetime, timezone

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.command.context import Context
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.timestamp import Timestamp
from core.modules.tasks.task import Task
from core.modules.tasks.task_lifecycle import TaskLifecycle
from core.modules.tasks.task_state import TaskState
from tests.unit.core.base.command.test_commands import ItemMake

STARTED = Task(id=1, version=1, environment_id=1, holder_id=2, creator_id=1, title="Fix the cart", state=TaskState.STARTED)


def moved(old_row: Model, new_row: Model) -> Change[Model]:
    return Change(old_row, new_row, Context(Actor(2, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), ItemMake(title="Dune"), frozenset()))


def test_task_retest_move():
    testing = STARTED.moved(TaskLifecycle.test)
    retested = testing.moved(TaskLifecycle.retest)
    LifecycleGuard().check(moved(testing, retested))
    assert (retested.state, retested.holder_id) == (TaskState.STARTED, 2)


def test_task_retest_refusal():
    with pytest.raises(Refusal) as raised:
        LifecycleGuard().check(moved(STARTED, STARTED.moved(TaskLifecycle.retest)))
    assert raised.value.text == ("task 1 is started, so it cannot retest: from started it can only go on with journal task block 1, journal task test 1,"
                                 " journal task close 1, journal task cancel 1")
