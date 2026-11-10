from datetime import datetime, timezone

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.change import Change
from engine.command.context import Context
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.guard.guard_switches import GuardSwitches
from core.base.model.model import Model
from engine.time.timestamp import Timestamp
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.core.base.model.test_model import Item

CHANGE = Change(None, Item(title="Dune"), Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), MakeItem(title="Dune")))


def test_every_guard_is_on_and_everything_applies_until_something_else_is_bound():
    assert GuardSwitches().enabled("items.no-second-item")
    assert ChangeFilter().applies("items.no-second-item", CHANGE)


class DisabledSwitches(GuardSwitches):
    def enabled(self, guard_name: str) -> bool:
        return guard_name != "items.no-second-item"


class RejectingChangeFilter(ChangeFilter):
    def applies(self, entry_name: str, change: Change[Model]) -> bool:
        return False


def test_a_layer_above_the_core_binds_its_own_switches_and_change_filter():
    container = Container()
    container.bind(GuardSwitches, DisabledSwitches())
    container.bind(ChangeFilter, RejectingChangeFilter())
    assert not container.get(GuardSwitches).enabled("items.no-second-item")
    assert not container.get(ChangeFilter).applies("items.no-second-item", CHANGE)
