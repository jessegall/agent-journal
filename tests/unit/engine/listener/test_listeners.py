import sys
from pathlib import Path
from datetime import datetime, timezone

import pytest

from tests.unit.engine.samples.scope_samples import empty_database_scopes
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.change import Change
from engine.event.event_pattern import EventPattern
from engine.command.context import Context
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.listener.deletion_listener import DeletionListener
from engine.listener.listeners import Listeners
from engine.listener.save_listener import SaveListener
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.listener_entry import ListenerEntry
from engine.enums.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.time.timestamp import Timestamp
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_model import Item
from engine.event.changed import Changed
from engine.event.created import Created
from engine.event.deleted import Deleted
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
import engine.listener.listeners as listener_runner

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


def listeners(home: Path, registry: Registry = REGISTRY) -> Listeners:
    HANDLED.clear()
    return Listeners(registry, Container(), ChangeFilter(), empty_database_scopes(), SystemLogWriter(JournalHome(home), Clock()))


def test_save_listeners_run_in_order_and_an_error_reaches_the_caller(tmp_path):
    with pytest.raises(RuntimeError, match="second listener failed"):
        listeners(tmp_path).run_save_listeners(Change(None, Item(id=4, version=1, title="Dune"), CONTEXT))
    assert HANDLED == ["items.first", "items.second"]


def test_a_pattern_lets_a_listener_hear_every_change_of_a_model(tmp_path):
    stored = Item(id=4, version=1, title="Dune")
    listeners(tmp_path).run_save_listeners(Change(stored, stored.changed(title="Emma"), CONTEXT))
    assert HANDLED == ["items.first"]


def test_deletion_listeners_run_only_for_deletions(tmp_path):
    listeners(tmp_path).run_deletion_listeners(Change(Item(id=4, version=1, title="Dune"), None, CONTEXT))
    assert HANDLED == ["notes.clear"]


def test_a_listener_whose_event_does_not_match_is_never_imported(tmp_path):
    sys.modules.pop("tests.unit.engine.samples.listener_sample", None)
    listeners(tmp_path).run_deletion_listeners(Change(Item(id=4, version=1, title="Dune"), None, CONTEXT))
    assert "tests.unit.engine.samples.listener_sample" not in sys.modules


def test_a_save_listener_that_runs_half_a_second_inside_the_write_lock_is_logged_by_name(tmp_path, monkeypatch):
    times = iter([10.0, 10.6])
    monkeypatch.setattr(listener_runner, "perf_counter", lambda: next(times))
    registry = Registry("abc", {}, {}, {}, (), (entry(SaveFirst, ListenerTiming.SAVE, 1),))
    runner = listeners(tmp_path, registry)
    runner.run_save_listeners(Change(None, Item(id=4, version=1, title="Dune"), CONTEXT))
    assert "save listener items.first ran 600 ms inside the write lock on item.create" in runner.system_log.path.read_text()
