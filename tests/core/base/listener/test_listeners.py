import sys
from datetime import datetime, timezone

import pytest

from core.base.actor import Actor, ActorType
from core.base.change.change import Change
from core.base.change.event_pattern import EventPattern
from core.base.command.context import Context
from core.base.container import Container
from core.base.guard.applicability import Applicability
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.listeners import Listeners
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry
from core.base.moment import Moment
from tests.core.base.command.test_commands import ItemMake
from tests.core.base.model.test_model import Item

HANDLED: list[str] = []


class FirstOnSave(SaveListener):
    name = "items.first"
    event = "item.*"

    def handle(self, change: Change[Model]) -> None:
        HANDLED.append(self.name)


class SecondOnSave(SaveListener):
    name = "items.second"
    event = "item.create"

    def handle(self, change: Change[Model]) -> None:
        HANDLED.append(self.name)
        raise RuntimeError("the second listener failed")


class ClearItemNotes(DeletionListener):
    name = "notes.clear"
    event = "item.delete"

    def handle(self, change: Change[Model]) -> None:
        HANDLED.append(self.name)


def entry(listener: type[SaveListener] | type[DeletionListener], timing: ListenerTiming, position: int) -> ListenerEntry:
    return ListenerEntry(listener.name, EventPattern(listener.event), timing, DottedPath.class_path(listener), position)


UNUSED = ListenerEntry("shelves.count", EventPattern("shelf.create"), ListenerTiming.SAVE, DottedPath("tests.core.base.samples.listener_sample:ShelfCounter"), 9)
REGISTRY = Registry("abc", {}, {}, {}, (), (entry(SecondOnSave, ListenerTiming.SAVE, 2), entry(FirstOnSave, ListenerTiming.SAVE, 1),
                                          entry(ClearItemNotes, ListenerTiming.DELETION, 1), UNUSED))
CONTEXT = Context(Actor(7, ActorType.AGENT), Moment(datetime(2026, 10, 31, tzinfo=timezone.utc)), ItemMake(title="Dune"))


def listeners() -> Listeners:
    HANDLED.clear()
    return Listeners(REGISTRY, Container(), Applicability())


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
    sys.modules.pop("tests.core.base.samples.listener_sample", None)
    listeners().run_deletion_listeners(Change(Item(id=4, version=1, title="Dune"), None, CONTEXT))
    assert "tests.core.base.samples.listener_sample" not in sys.modules
