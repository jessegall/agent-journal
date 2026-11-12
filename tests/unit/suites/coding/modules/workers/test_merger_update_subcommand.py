from types import SimpleNamespace

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update_handler import OrderWorkerUpdateHandler
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState as State
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_decisions import BehindDecisions
from suites.coding.modules.workers.support.behind_nudges import UPDATE_ORDERED
from tests.unit.suites.coding.modules.workers.support.test_behind_check_closing import WORKTREE

MERGER, MAIN, OTHER, WORKER = 12, 1, 30, 7


class Agents:
    def find(self, agent_id: int):
        return SimpleNamespace(id=agent_id, profile="journal-merger" if agent_id == MERGER else "")

    def is_main(self, agent_id: int) -> bool:
        return agent_id == MAIN


class Worktrees:
    def __init__(self, found: bool = True) -> None:
        self.found = found

    def worker_worktree(self, worker_id: int):
        return WORKTREE if self.found else None


class Checks:
    def __init__(self, *states: State) -> None:
        self.rows = [WorktreeBehindCheck(id=number, environment_id=1, worktree_id=1, base_tip="abc", behind=4, state=state) for number, state in enumerate(states, 1)]

    def query(self, model: type) -> "Checks":
        return self

    def filter(self, **values: object) -> "Checks":
        return self

    def newest(self) -> "Checks":
        return self

    def all_rows(self) -> list[WorktreeBehindCheck]:
        return self.rows

    def find(self, row_id: int):
        return SimpleNamespace(program="claude", program_model="sonnet")


class Numbers:
    def number(self, model: str, row_id: int) -> int:
        return 999


class Repository:
    def __init__(self) -> None:
        self.saved: list[WorktreeBehindCheck] = []

    def save(self, row, context):
        self.saved.append(row)
        return row

    def save_change(self, row, changed, context):
        self.saved.append(changed)
        return changed


class Visits:
    def __init__(self) -> None:
        self.closed = 0

    def close_newest(self, context) -> None:
        self.closed += 1


class Nudger:
    def __init__(self) -> None:
        self.sent: list[tuple[int, object, dict]] = []

    def send(self, agent_id, declaration, source, context, **fields) -> None:
        self.sent.append((agent_id, declaration, fields))


class Reader:
    def read(self, worktree, worker):
        return SimpleNamespace(overlap=("src/cart.py", "src/tax.py"), behind=4, base_tip="abc")


def handler(checks: Checks, worktrees: Worktrees | None = None) -> tuple[OrderWorkerUpdateHandler, Repository, Visits, Nudger]:
    repository, visits, nudger = Repository(), Visits(), Nudger()
    decisions = BehindDecisions(worktrees or Worktrees(), checks, Numbers())
    return OrderWorkerUpdateHandler(Agents(), decisions, Reader(), checks, repository, visits, nudger), repository, visits, nudger


def ordered_by(actor_id: int, checks: Checks, worktrees: Worktrees | None = None):
    order, repository, visits, nudger = handler(checks, worktrees)
    command = OrderWorkerUpdate(WORKER, "cart.py is changed on both sides")
    order.prepare(command, Actor(actor_id, ActorType.AGENT))
    order.handle(command, SimpleNamespace(actor=Actor(actor_id, ActorType.AGENT)))
    return repository, visits, nudger


def test_the_merger_orders_the_update_with_who_and_why_and_the_worker_is_woken_with_how_far_its_base_moved():
    repository, visits, nudger = ordered_by(MERGER, Checks(State.OPEN))
    check = repository.saved[0]
    assert (check.state, check.decided_by, check.reason, visits.closed) == (State.ORDERED, MERGER, "cart.py is changed on both sides", 1)
    worker, declaration, fields = nudger.sent[0]
    assert (worker, declaration, fields) == (WORKER, UPDATE_ORDERED, {"count": 4})
    assert "Run journal worker update when you are at a stopping point." in UPDATE_ORDERED.nudge(**fields).text


def test_the_main_agent_may_order_after_a_pass_and_another_agent_is_refused():
    assert ordered_by(MAIN, Checks(State.PASSED))[0].saved[0].state is State.ORDERED
    with pytest.raises(Refusal, match="only the merger or the main agent"):
        ordered_by(OTHER, Checks(State.OPEN))


@pytest.mark.parametrize("checks, worktrees, refusal", [(Checks(), None, "no open check for this worker"), (Checks(State.LEFT, State.UPDATED), None, "no open check for this worker"),
                                                        (Checks(State.OPEN), Worktrees(found=False), "no worker 999 with a worktree in this environment")])
def test_an_order_is_refused_with_no_check_to_decide_or_no_worktree(checks, worktrees, refusal):
    with pytest.raises(Refusal, match=refusal):
        ordered_by(MERGER, checks, worktrees)
