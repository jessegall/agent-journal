import sys
from datetime import datetime, timezone

import pytest

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.command.context import Context
from core.base.container import Container
from core.base.guard.applicability import Applicability
from core.base.guard.guard import Guard
from core.base.guard.guard_switches import GuardSwitches
from core.base.guard.guards import Guards
from core.base.guard_refusal import GuardRefusal
from core.base.model.model import Model
from core.base.module.dotted_path import DottedPath
from core.base.module.guard_entry import GuardEntry
from core.base.module.registry import Registry
from core.base.moment import Moment
from core.base.refusal import Refusal
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_model import Loan

ASKED: list[str] = []


class LifecycleStandIn(Guard):
    """A stand-in for the lifecycle guard, which is always asked."""

    name = "core.lifecycle"
    event = "*"

    def check(self, change: Change[Model]) -> None:
        ASKED.append(self.name)


class NoSecondLoan(Guard):
    """A title is lent once at a time."""

    name = "loans.no-second-loan"
    event = "loan.create"

    def check(self, change: Change[Model]) -> None:
        ASKED.append(self.name)
        raise Refusal("Dune is lent already", "wait for it to come back")


class AfterTheRefusal(Guard):
    """Asked only if the guards before it pass."""

    name = "loans.after"
    event = "loan.create"

    def check(self, change: Change[Model]) -> None:
        ASKED.append(self.name)


def entry(guard: type[Guard], position: int, short_flag: str = "") -> GuardEntry:
    return GuardEntry(guard.name, EventPattern(guard.event), DottedPath.class_path(guard), position, short_flag)


UNUSED = GuardEntry("shelves.weekdays-only", EventPattern("shelf.update"), DottedPath("tests.core.base.unused_guard_sample:ShelvesOnlyGuard"), 9, "")
REGISTRY = Registry("abc", {}, {}, {}, (entry(AfterTheRefusal, 3), entry(NoSecondLoan, 2, "confirm"), entry(LifecycleStandIn, 1), UNUSED), ())


def change(skipped: frozenset[str] = frozenset()) -> Change[Model]:
    context = Context(Actor(7, ActorType.AGENT), Moment(datetime(2026, 10, 31, tzinfo=timezone.utc)), LoanMake(title="Dune"), skipped)
    return Change(None, Loan(title="Dune"), context)


def guards(switches: GuardSwitches = GuardSwitches(), applicability: Applicability = Applicability()) -> Guards:
    ASKED.clear()
    return Guards(REGISTRY, Container(), switches, applicability)


def test_guards_are_asked_in_order_and_the_first_refusal_stops_the_rest():
    with pytest.raises(GuardRefusal) as caught:
        guards().ask(change())
    assert ASKED == ["core.lifecycle", "loans.no-second-loan"]
    assert caught.value.text == "refused by loans.no-second-loan: Dune is lent already: wait for it to come back (to pass it knowingly: --confirm)"


def test_a_guard_asked_to_be_skipped_is_passed_over_and_recorded():
    assert guards().ask(change(frozenset({"loans.no-second-loan"}))) == frozenset({"loans.no-second-loan"})
    assert ASKED == ["core.lifecycle", "loans.after"]


def test_a_switched_off_guard_is_passed_over():
    class Off(GuardSwitches):
        def is_on(self, guard_name: str) -> bool:
            return guard_name != "loans.no-second-loan"

    guards(switches=Off()).ask(change())
    assert ASKED == ["core.lifecycle", "loans.after"]


def test_a_guard_that_does_not_apply_is_passed_over_but_the_lifecycle_never_is():
    class Never(Applicability):
        def applies(self, entry_name: str, change: Change[Model]) -> bool:
            return False

    guards(applicability=Never()).ask(change(frozenset({"core.lifecycle"})))
    assert ASKED == ["core.lifecycle"]


def test_a_guard_whose_event_does_not_match_is_never_imported():
    sys.modules.pop("tests.core.base.unused_guard_sample", None)
    guards().ask(change(frozenset({"loans.no-second-loan"})))
    assert "tests.core.base.unused_guard_sample" not in sys.modules
