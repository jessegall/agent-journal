from datetime import datetime, timezone

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.change import Change
from engine.command.context import Context
from engine.container.container import Container
from engine.guard.guard_switches import GuardSwitches
from engine.time.timestamp import Timestamp
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_model import Item

CHANGE = Change(None, Item(title="Dune"), Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), MakeItem(title="Dune")))


def test_every_guard_is_on_until_something_else_is_bound():
    assert GuardSwitches().enabled("items.no-second-item")


class DisabledSwitches(GuardSwitches):
    def enabled(self, guard_name: str) -> bool:
        return guard_name != "items.no-second-item"

def test_a_layer_above_the_core_binds_its_own_switches():
    container = Container()
    container.bind(GuardSwitches, DisabledSwitches())
    assert not container.get(GuardSwitches).enabled("items.no-second-item")
