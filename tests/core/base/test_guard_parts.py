from datetime import datetime, timezone

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.command.context import Context
from core.base.container import Container
from core.base.guard.applicability import Applicability
from core.base.guard.guard_switches import GuardSwitches
from core.base.model.model import Model
from core.base.moment import Moment
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_model import Loan

CHANGE = Change(None, Loan(title="Dune"), Context(Actor(7, ActorType.AGENT), Moment(datetime(2026, 10, 31, tzinfo=timezone.utc)), LoanMake(title="Dune")))


def test_every_guard_is_on_and_everything_applies_until_something_else_is_bound():
    assert GuardSwitches().is_on("loans.no-second-loan")
    assert Applicability().applies("loans.no-second-loan", CHANGE)


class SwitchedOff(GuardSwitches):
    def is_on(self, guard_name: str) -> bool:
        return guard_name != "loans.no-second-loan"


class OnlyOnSundays(Applicability):
    def applies(self, entry_name: str, change: Change[Model]) -> bool:
        return False


def test_a_layer_above_the_core_binds_its_own_switches_and_applicability():
    container = Container()
    container.bind(GuardSwitches, SwitchedOff())
    container.bind(Applicability, OnlyOnSundays())
    assert not container.get(GuardSwitches).is_on("loans.no-second-loan")
    assert not container.get(Applicability).applies("loans.no-second-loan", CHANGE)
