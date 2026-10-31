import sys
from datetime import datetime, timezone

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.command.context import Context
from core.base.container import Container
from core.base.guard.change_filter import ChangeFilter
from core.base.guard.guard import Guard
from core.base.guard.guard_switches import GuardSwitches
from core.base.guard.guards import Guards
from core.base.guard_refusal import GuardRefusal
from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.registry import Registry
from core.base.timestamp import Timestamp
from core.base.refusal import Refusal
from tests.unit.core.base.command.test_commands import ItemMake
from tests.unit.core.base.model.test_model import Item

GUARD_CALLS: list[str] = []


class PlaceholderLifecycleGuard(Guard):
    """A placeholder for the lifecycle guard, which is always asked."""

    name = "core.lifecycle"
    event = "*"

    def check(self, change: Change[Model]) -> None:
        GUARD_CALLS.append(self.name)


class NoSecondItem(Guard):
    """Only one open item may carry a title."""

    name = "items.no-second-item"
    event = "item.create"

    def check(self, change: Change[Model]) -> None:
        GUARD_CALLS.append(self.name)
        raise Refusal("an item titled Dune is open already", "close it first")


class SecondGuard(Guard):
    """Asked only if the guards before it pass."""

    name = "items.after"
    event = "item.create"

    def check(self, change: Change[Model]) -> None:
        GUARD_CALLS.append(self.name)


def entry(guard: type[Guard], position: int, short_flag: str = "") -> GuardEntry:
    return GuardEntry(guard.name, EventPattern(guard.event), DottedPath.class_path(guard), position, short_flag)


UNUSED = GuardEntry("shelves.weekdays-only", EventPattern("shelf.update"), DottedPath("tests.unit.core.base.samples.unused_guard_sample:ShelfGuard"), 9, "")
REGISTRY = Registry("abc", {}, {}, {}, (entry(SecondGuard, 3), entry(NoSecondItem, 2, "confirm"), entry(PlaceholderLifecycleGuard, 1), UNUSED), ())


def change(skipped: frozenset[str] = frozenset()) -> Change[Model]:
    context = Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), ItemMake(title="Dune"), skipped)
    return Change(None, Item(title="Dune"), context)


def guards(switches: GuardSwitches = GuardSwitches(), change_filter: ChangeFilter = ChangeFilter()) -> Guards:
    GUARD_CALLS.clear()
    return Guards(REGISTRY, Container(), switches, change_filter)


def test_guards_are_asked_in_order_and_the_first_refusal_stops_the_rest():
    with pytest.raises(GuardRefusal) as raised:
        guards().ask(change())
    assert GUARD_CALLS == ["core.lifecycle", "items.no-second-item"]
    assert raised.value.text == "refused by items.no-second-item: an item titled Dune is open already: close it first (to pass it: --confirm)"


def test_a_guard_asked_to_be_skipped_is_passed_over_and_recorded():
    assert guards().ask(change(frozenset({"items.no-second-item"}))) == frozenset({"items.no-second-item"})
    assert GUARD_CALLS == ["core.lifecycle", "items.after"]


def test_a_switched_off_guard_is_passed_over():
    class Off(GuardSwitches):
        def enabled(self, guard_name: str) -> bool:
            return guard_name != "items.no-second-item"

    guards(switches=Off()).ask(change())
    assert GUARD_CALLS == ["core.lifecycle", "items.after"]


def test_a_guard_that_does_not_apply_is_passed_over_but_the_lifecycle_never_is():
    class RejectingChangeFilter(ChangeFilter):
        def applies(self, entry_name: str, change: Change[Model]) -> bool:
            return False

    guards(change_filter=RejectingChangeFilter()).ask(change(frozenset({"core.lifecycle"})))
    assert GUARD_CALLS == ["core.lifecycle"]


def test_a_guard_whose_event_does_not_match_is_never_imported():
    sys.modules.pop("tests.unit.core.base.samples.unused_guard_sample", None)
    guards().ask(change(frozenset({"items.no-second-item"})))
    assert "tests.unit.core.base.samples.unused_guard_sample" not in sys.modules
