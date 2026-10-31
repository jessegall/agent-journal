from datetime import datetime, timezone

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.command.context import Context
from core.base.container import Container
from core.base.guard.change_filter import ChangeFilter
from core.base.guard.guard_switches import GuardSwitches
from core.base.guard.guards import Guards
from core.base.guard.lifecycle_guard import LifecycleGuard
from core.base.guard.guard_refusal import GuardRefusal
from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.registry import Registry
from core.base.timestamp import Timestamp
from core.base.refusal import Refusal
from tests.unit.core.base.command.test_commands import MakeItem
from tests.unit.core.base.model.test_lifecycle import ItemLifecycle, ItemState
from tests.unit.core.base.model.test_model import Item


def change(old_row: Item | None, new_row: Item | None, skipped: frozenset[str] = frozenset()) -> Change[Model]:
    return Change(old_row, new_row, Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), MakeItem(title="Dune"), skipped))


OPEN = Item(id=4, version=1, title="Dune")
CLOSED = Item(id=4, version=1, title="Dune", state=ItemState.CLOSED)


def refusal(old_row: Item | None, new_row: Item | None) -> str:
    with pytest.raises(Refusal) as raised:
        LifecycleGuard().check(change(old_row, new_row))
    return raised.value.text


def test_a_new_row_starts_in_a_first_state():
    LifecycleGuard().check(change(None, Item(title="Dune")))
    assert refusal(None, Item(title="Dune", state=ItemState.PAUSED)) == "a new item starts as open, not paused"


def test_a_move_starts_only_from_one_of_its_states():
    LifecycleGuard().check(change(OPEN, OPEN.moved(ItemLifecycle.pause)))
    paused = Item(id=4, version=1, title="Dune", state=ItemState.PAUSED)
    assert refusal(paused, paused.moved(ItemLifecycle.pause)) == "item 4 is paused, so it cannot pause: from paused it can only go on with journal item close 4"


def test_an_edit_happens_only_in_an_editable_state():
    LifecycleGuard().check(change(OPEN, OPEN.changed(title="Dune Messiah")))
    assert refusal(CLOSED, CLOSED.changed(title="Dune Messiah")) == "item 4 is closed, so it cannot be edited: closed is final"


def test_a_delete_happens_only_in_a_deletable_state():
    LifecycleGuard().check(change(OPEN, None))
    assert refusal(CLOSED, None) == "item 4 is closed, so it cannot be deleted: closed is final"


def test_a_change_of_metadata_alone_is_no_edit_and_raises_no_event():
    metadata_change = change(CLOSED, CLOSED.changed(metadata=Metadata.parsed('{"reviews": {"asked": true}}')))
    assert metadata_change.is_empty


def test_the_lifecycle_guard_can_be_neither_skipped_nor_switched_off():
    class AllOff(GuardSwitches):
        def enabled(self, guard_name: str) -> bool:
            return False

    registry = Registry("abc", {}, {}, {}, [GuardEntry("core.lifecycle", EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, "")], ())
    guards = Guards(registry, Container(), AllOff(), ChangeFilter())
    with pytest.raises(GuardRefusal) as raised:
        guards.ask(change(CLOSED, None, frozenset({"core.lifecycle"})))
    assert raised.value.text == "refused by core.lifecycle: item 4 is closed, so it cannot be deleted: closed is final"
