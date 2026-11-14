from dataclasses import dataclass
from types import SimpleNamespace

import pytest

from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.support.worker_free_task import WorkerFreeTask

WORKER = 7
FREE_TASK = SimpleNamespace(id=40)


class Rows:
    def found(self, kept: list[object]) -> "Rows":
        self.held = kept
        return self

    def first(self):
        return next(iter(self.held), None)

    def filter(self, state):
        return Rows().found([task for task in self.held if task.state is state])


class Tasks:
    def __init__(self, assigned=(), kept=(), testing=()) -> None:
        self.assigned, self.held, self.testing = list(assigned), list(kept), list(testing)

    def unfinished_assigned(self, worker_id):
        return tuple(self.assigned)

    def holder_started(self, worker_id):
        return Rows().found(self.held)

    def assignee_tasks(self, worker_id):
        return Rows().found(self.testing)

    def next_simple(self, complexity, exclusion):
        return FREE_TASK


@dataclass(frozen=True)
class Asker:
    """What the free task reads of the command's context: who asks."""

    actor: object = None


class Bus:
    def __init__(self) -> None:
        self.commands = []

    def dispatch(self, command, context):
        self.commands.append(command)


def given(tasks: Tasks) -> list[int]:
    bus = Bus()
    rows = SimpleNamespace(required=lambda model, row_id: SimpleNamespace(id=row_id, ended_at=None))
    places = SimpleNamespace(running=lambda: [], run_limit=lambda: 2)
    plans = SimpleNamespace(plan_exclusion=lambda: None)
    WorkerFreeTask(tasks, plans, bus, rows, places).give_next(WORKER, Asker())
    return [command.task_id for command in bus.commands]


def test_a_worker_with_no_task_is_given_the_free_task():
    assert given(Tasks()) == [FREE_TASK.id]


@pytest.mark.parametrize("tasks", [Tasks(assigned=[SimpleNamespace(id=1, state=TaskState.OPEN)]), Tasks(kept=[SimpleNamespace(id=2, state=TaskState.STARTED)]),
                                   Tasks(testing=[SimpleNamespace(id=3, state=TaskState.TESTING)])], ids=["assigned", "held started", "waiting for tests"])
def test_a_worker_that_still_has_a_task_is_given_none(tasks):
    assert given(tasks) == []
