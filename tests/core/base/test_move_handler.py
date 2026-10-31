from dataclasses import dataclass

import pytest

from core.base.actor import Actor
from core.base.change.event_pattern import EventPattern
from core.base.command.handlers.move_handler import MoveHandler
from core.base.command.move_command import MoveCommand
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.guard_refusal import GuardRefusal
from core.base.module.dotted_path import DottedPath
from core.base.module.guard_entry import GuardEntry
from core.base.module.registry import Registry
from core.base.moment import Moment
from core.base.repository.repository import Repository
from tests.core.base.harness import context, harness
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState
from tests.core.base.test_model import Loan


@dataclass(frozen=True, kw_only=True)
class ReturnableLoan(Loan):
    def bring_back(self, moment: Moment, actor: Actor) -> "ReturnableLoan":
        return self.moved(LoanLifecycle.bring_back, title=f"{self.title} (returned)")


@dataclass(frozen=True)
class LoanOverdue(MoveCommand[Loan]):
    move = LoanLifecycle.overdue


@dataclass(frozen=True)
class LoanBringBack(MoveCommand[ReturnableLoan]):
    move = LoanLifecycle.bring_back


@pytest.fixture
def container(tmp_path):
    lifecycle = GuardEntry(LifecycleGuard.name, EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, "")
    built = harness(tmp_path, Registry("abc", {}, {}, {}, (lifecycle,), ()))
    built.get(Repository).save(ReturnableLoan(title="Dune"), context(LoanMake(title="Dune")))
    return built


def test_a_move_the_model_writes_no_method_for_sets_only_the_state(container):
    moved = container.get(MoveHandler).handle(LoanOverdue(row_id=1), context(LoanOverdue(row_id=1)))
    assert (moved.state, moved.version) == (LoanState.LATE, 2)


def test_a_move_the_model_has_a_method_for_sets_its_own_fields_too(container):
    moved = container.get(MoveHandler).handle(LoanBringBack(row_id=1), context(LoanBringBack(row_id=1)))
    assert isinstance(moved, ReturnableLoan) and (moved.state, moved.title) == (LoanState.RETURNED, "Dune (returned)")


def test_a_move_from_the_wrong_state_is_refused_by_the_lifecycle(container):
    container.get(MoveHandler).handle(LoanBringBack(row_id=1), context(LoanBringBack(row_id=1)))
    with pytest.raises(GuardRefusal, match="loan 1 is returned, so it cannot overdue"):
        container.get(MoveHandler).handle(LoanOverdue(row_id=1), context(LoanOverdue(row_id=1)))
