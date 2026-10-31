from datetime import datetime, timezone

import pytest

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.command.context import Context
from core.base.container import Container
from core.base.guard.applicability import Applicability
from core.base.guard.guard_switches import GuardSwitches
from core.base.guard.guards import Guards
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.guard_refusal import GuardRefusal
from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.registry import Registry
from core.base.moment import Moment
from core.base.refusal import Refusal
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState
from tests.core.base.test_model import Loan


def change(old_row: Loan | None, new_row: Loan | None, skipped: frozenset[str] = frozenset()) -> Change[Model]:
    return Change(old_row, new_row, Context(Actor(7, ActorType.AGENT), Moment(datetime(2026, 10, 31, tzinfo=timezone.utc)), LoanMake(title="Dune"), skipped))


LENT = Loan(id=4, version=1, title="Dune")
RETURNED = Loan(id=4, version=1, title="Dune", state=LoanState.RETURNED)


def refusal(old_row: Loan | None, new_row: Loan | None) -> str:
    with pytest.raises(Refusal) as caught:
        LifecycleGuard().check(change(old_row, new_row))
    return caught.value.text


def test_a_new_row_starts_in_a_first_state():
    LifecycleGuard().check(change(None, Loan(title="Dune")))
    assert refusal(None, Loan(title="Dune", state=LoanState.LATE)) == "a new loan starts as lent, not late"


def test_a_move_starts_only_from_one_of_its_states():
    LifecycleGuard().check(change(LENT, LENT.moved(LoanLifecycle.overdue)))
    late = Loan(id=4, version=1, title="Dune", state=LoanState.LATE)
    assert refusal(late, late.moved(LoanLifecycle.overdue)) == "loan 4 is late, so it cannot overdue: from late it can only go on with journal loan bring_back 4"


def test_an_edit_happens_only_in_an_editable_state():
    LifecycleGuard().check(change(LENT, LENT.changed(title="Dune Messiah")))
    assert refusal(RETURNED, RETURNED.changed(title="Dune Messiah")) == "loan 4 is returned, so it cannot be edited: returned is final"


def test_a_delete_happens_only_in_a_deletable_state():
    LifecycleGuard().check(change(LENT, None))
    assert refusal(RETURNED, None) == "loan 4 is returned, so it cannot be deleted: returned is final"


def test_a_change_of_metadata_alone_is_no_edit_and_raises_no_event():
    metadata_change = change(RETURNED, RETURNED.changed(metadata=Metadata.parsed('{"reviews": {"asked": true}}')))
    assert metadata_change.is_empty


def test_the_lifecycle_guard_can_be_neither_skipped_nor_switched_off():
    class AllOff(GuardSwitches):
        def enabled(self, guard_name: str) -> bool:
            return False

    registry = Registry("abc", {}, {}, {}, (GuardEntry("core.lifecycle", EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, ""),), ())
    guards = Guards(registry, Container(), AllOff(), Applicability())
    with pytest.raises(GuardRefusal) as caught:
        guards.ask(change(RETURNED, None, frozenset({"core.lifecycle"})))
    assert caught.value.text == "refused by core.lifecycle: loan 4 is returned, so it cannot be deleted: returned is final"
