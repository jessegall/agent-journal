from dataclasses import replace
from datetime import datetime, timezone

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.change import Change
from engine.change.event_pattern import EventPattern
from engine.command.context import Context
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.guard.guard_switches import GuardSwitches
from engine.guard.guards import Guards
from engine.guard.lifecycle_guard import LifecycleGuard
from engine.model.added_state import AddedState
from engine.model.move import Move
from engine.model.state_book import StateBook
from engine.model.unknown_state_error import UnknownStateError
from engine.guard.errors.guard_refusal import GuardRefusal
from engine.row.metadata import Metadata
from engine.model.model import Model
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.guard_entry import GuardEntry
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from engine.errors.refusal import Refusal
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_lifecycle import ItemLifecycle, ItemState
from tests.unit.engine.model.test_model import Item


def checked(old_row: Item | None, new_row: Item | None) -> None:
    change = read_change(old_row, new_row)
    LifecycleGuard(StateBook()).check(change.typed_event(LifecycleGuard), change.context)


def read_change(old_row: Item | None, new_row: Item | None, skipped: frozenset[str] = frozenset()) -> Change[Model]:
    return Change(old_row, new_row, Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), MakeItem(title="Dune"), skipped))


OPEN = Item(id=4, version=1, title="Dune")
CLOSED = Item(id=4, version=1, title="Dune", state=ItemState.CLOSED)


def refusal(old_row: Item | None, new_row: Item | None) -> str:
    with pytest.raises(Refusal) as raised:
        checked(old_row, new_row)
    return raised.value.text


def test_a_new_row_starts_in_a_first_state():
    checked(None, Item(title="Dune"))
    assert refusal(None, Item(title="Dune", state=ItemState.PAUSED)) == "a new item starts as open, not paused"


def test_a_move_starts_only_from_one_of_its_states():
    checked(OPEN, OPEN.moved(ItemLifecycle.pause))
    paused = Item(id=4, version=1, title="Dune", state=ItemState.PAUSED)
    assert refusal(paused, paused.moved(ItemLifecycle.pause)) == "item 4 is paused, so it cannot pause: from paused it can only go on with journal item close 4"


def test_a_move_its_model_does_not_have_is_refused():
    assert "so it cannot other" in refusal(OPEN, OPEN.moved(Move("other", [ItemState.OPEN], ItemState.CLOSED)))


def test_saving_a_state_nothing_registers_raises_unknown_state():
    with pytest.raises(UnknownStateError, match="reviewing is no state of an item"):
        checked(OPEN, replace(OPEN, state=AddedState("reviewing")))


def test_an_edit_happens_only_in_an_editable_state():
    checked(OPEN, OPEN.changed(title="Dune Messiah"))
    assert refusal(CLOSED, CLOSED.changed(title="Dune Messiah")) == "item 4 is closed, so it cannot be edited: closed is final"


def test_a_delete_happens_only_in_a_deletable_state():
    checked(OPEN, None)
    assert refusal(CLOSED, None) == "item 4 is closed, so it cannot be deleted: closed is final"


def test_a_change_of_metadata_alone_is_no_edit_and_raises_no_event():
    metadata_change = read_change(CLOSED, CLOSED.changed(metadata=Metadata.parsed('{"reviews": {"asked": true}}')))
    assert metadata_change.is_empty


def test_the_lifecycle_guard_can_be_neither_skipped_nor_switched_off():
    class AllOff(GuardSwitches):
        def enabled(self, guard_name: str) -> bool:
            return False

    registry = Registry("abc", {}, {}, {}, [GuardEntry("core.lifecycle", EventPattern("*"), DottedPath.class_path(LifecycleGuard), 1, "")], ())
    guards = Guards(registry, Container(), AllOff(), ChangeFilter())
    with pytest.raises(GuardRefusal) as raised:
        guards.ask(read_change(CLOSED, None, frozenset({"core.lifecycle"})))
    assert raised.value.text == "refused by core.lifecycle: item 4 is closed, so it cannot be deleted: closed is final"
