import sys
from datetime import datetime, timezone

import pytest

from tests.unit.engine.samples.scope_samples import empty_database_scopes
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.change import Change
from engine.change.event_pattern import EventPattern
from engine.command.context import Context
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.listener.deletion_listener import DeletionListener
from engine.listener.listeners import Listeners
from engine.listener.save_listener import SaveListener
from engine.model.model import Model
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.listener_entry import ListenerEntry
from engine.registry.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_model import Item
from engine.change.changed import Changed
from engine.change.created import Created
from engine.change.deleted import Deleted

HANDLED: list[str] = []


class SaveFirst(SaveListener[Changed[Item]]):
    name = "items.first"

    def handle(self, event: Changed[Item], context: Context) -> None:
        HANDLED.append(self.name)


class SaveSecond(SaveListener[Created[Item]]):
    name = "items.second"

    def handle(self, event: Created[Item], context: Context) -> None:
        HANDLED.append(self.name)
        raise RuntimeError("the second listener failed")


class ClearItemNotes(DeletionListener[Deleted[Item]]):
    name = "notes.clear"

    def handle(self, event: Deleted[Item], context: Context) -> None:
        HANDLED.append(self.name)


def entry(listener: type[SaveListener] | type[DeletionListener], timing: ListenerTiming, position: int) -> ListenerEntry:
    return ListenerEntry(listener.name, EventPattern(listener.event), timing, DottedPath.class_path(listener), position)


UNUSED = ListenerEntry("shelves.count", EventPattern("shelf.create"), ListenerTiming.SAVE, DottedPath("tests.unit.engine.samples.listener_sample:ShelfCounter"), 9)
REGISTRY = Registry("abc", {}, {}, {}, (), (entry(SaveSecond, ListenerTiming.SAVE, 2), entry(SaveFirst, ListenerTiming.SAVE, 1),
                                          entry(ClearItemNotes, ListenerTiming.DELETION, 1), UNUSED))
CONTEXT = Context(Actor(7, ActorType.AGENT), Timestamp(datetime(2026, 10, 31, tzinfo=timezone.utc)), MakeItem(title="Dune"))


def listeners() -> Listeners:
    HANDLED.clear()
    return Listeners(REGISTRY, Container(), ChangeFilter(), empty_database_scopes())


def test_save_listeners_run_in_order_and_an_error_reaches_the_caller():
    with pytest.raises(RuntimeError, match="second listener failed"):
        listeners().run_save_listeners(Change(None, Item(id=4, version=1, title="Dune"), CONTEXT))
    assert HANDLED == ["items.first", "items.second"]


def test_a_pattern_lets_a_listener_hear_every_change_of_a_model():
    stored = Item(id=4, version=1, title="Dune")
    listeners().run_save_listeners(Change(stored, stored.changed(title="Emma"), CONTEXT))
    assert HANDLED == ["items.first"]


def test_deletion_listeners_run_only_for_deletions():
    listeners().run_deletion_listeners(Change(Item(id=4, version=1, title="Dune"), None, CONTEXT))
    assert HANDLED == ["notes.clear"]


def test_a_listener_whose_event_does_not_match_is_never_imported():
    sys.modules.pop("tests.unit.engine.samples.listener_sample", None)
    listeners().run_deletion_listeners(Change(Item(id=4, version=1, title="Dune"), None, CONTEXT))
    assert "tests.unit.engine.samples.listener_sample" not in sys.modules
