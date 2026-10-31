from dataclasses import dataclass

import pytest

from core.base.actor import Actor, ActorType
from core.base.change.event_log import EventLog
from core.base.change.event_pattern import EventPattern
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.handlers.delete_handler import DeleteHandler
from core.base.command.handlers.edit_handler import EditHandler
from core.base.command.handlers.make_handler import MakeHandler
from core.base.command.handlers.move_handler import MoveHandler
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import MoveCommand
from core.base.database.database import Database
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.statement import Statement
from core.base.listener.commit_listener import CommitListener
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.registry.dotted_path import DottedPath
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry
from tests.core.base.harness import harness
from tests.core.base.command.test_commands import ItemMake
from tests.core.base.model.test_lifecycle import ItemLifecycle
from tests.core.base.model.test_model import Item

AGENT = Actor(7, ActorType.AGENT)
HANDLED: list[str] = []


@dataclass(frozen=True)
class ItemPause(MoveCommand[Item]):
    move = ItemLifecycle.pause


class NewItemPauser(CommitListener):
    """Pauses every new item, which raises an event of its own."""

    name = "items.mark-pause"
    event = "item.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        HANDLED.append(f"pause {event.row_id}")
        self.bus.run(ItemPause(row_id=event.row_id), Actor(event.actor_id, ActorType.MODULE), cause_id=event.id)


class PausedItemCounter(CommitListener):
    """Counts the items paused."""

    name = "items.paused-count"
    event = "item.pause"

    def handle(self, event: LoggedEvent) -> None:
        HANDLED.append(f"counted {event.row_id}")


class FailingListener(CommitListener):
    """Fails on every event."""

    name = "items.always-fails"
    event = "item.create"

    def handle(self, event: LoggedEvent) -> None:
        HANDLED.append("failed")
        raise RuntimeError("the listener failed")


def entry(listener: type[CommitListener], position: int) -> ListenerEntry:
    return ListenerEntry(listener.name, EventPattern(listener.event), ListenerTiming.COMMIT, DottedPath.class_path(listener), position, 3)


def container_with(tmp_path, *listeners: type[CommitListener]):
    HANDLED.clear()
    pairs = ((MakeCommand, MakeHandler), (MoveCommand, MoveHandler), (EditCommand, EditHandler), (DeleteCommand, DeleteHandler))
    handlers = {DottedPath.class_path(command).text: DottedPath.class_path(handler) for command, handler in pairs}
    registry = Registry("abc", {}, handlers, {}, (), tuple(entry(listener, position) for position, listener in enumerate(listeners, 1)))
    container = harness(tmp_path, registry)
    for listener in listeners:
        container.get(ListenerCursorTable).start(listener.name)
    return container


def cursor(container, name: str) -> int:
    return container.get(Database).rows(Statement("SELECT event_id FROM listener_cursors WHERE listener = ?", (name,)))[0][0]


def test_a_listener_passes_over_the_events_it_does_not_cover(tmp_path):
    container = container_with(tmp_path, PausedItemCounter)
    container.get(Bus).run(ItemMake(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert (HANDLED, cursor(container, PausedItemCounter.name)) == ([], 1)


def test_listeners_catch_up_and_follow_a_chain_to_its_end(tmp_path):
    container = container_with(tmp_path, NewItemPauser, PausedItemCounter)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(ItemMake(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["pause 1", "counted 1"]
    assert container.get(EventLog).event(2).cause_id == 1
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["pause 1", "counted 1"]


def test_an_event_that_fails_three_times_is_skipped_and_the_listener_goes_on(tmp_path):
    container = container_with(tmp_path, FailingListener)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(ItemMake(title="Dune"), AGENT)
    for _ in range(3):
        container.get(CommitListenerRunner).run()
    assert HANDLED == ["failed", "failed", "failed"]
    assert cursor(container, FailingListener.name) == 1
    assert container.get(Database).rows(Statement("SELECT failures FROM listener_skips"))[0][0] == 3


def test_a_runner_that_read_an_old_position_cannot_claim_an_event_another_runner_took(tmp_path):
    container = container_with(tmp_path, PausedItemCounter)
    container.get(Bus).run(ItemMake(title="Dune"), AGENT)
    cursors = container.get(ListenerCursorTable)
    assert cursors.claimed(PausedItemCounter.name, 0, 1)
    assert not cursors.claimed(PausedItemCounter.name, 0, 1)
    assert cursor(container, PausedItemCounter.name) == 1


@pytest.mark.parametrize("runs", [1, 2])
def test_running_again_with_nothing_new_handles_nothing(tmp_path, runs: int):
    container = container_with(tmp_path, PausedItemCounter)
    for _ in range(runs):
        container.get(CommitListenerRunner).run()
    assert HANDLED == []
