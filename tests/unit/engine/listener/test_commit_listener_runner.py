from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.event_log import EventLog, PAGE_SIZE_EVENTS
from engine.change.event_pattern import EventPattern
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.command.delete_command import DeleteCommand
from engine.command.edit_command import EditCommand
from engine.command.handlers.delete_handler import DeleteHandler
from engine.command.handlers.edit_handler import EditHandler
from engine.command.handlers.make_handler import MakeHandler
from engine.command.handlers.move_handler import MoveHandler
from engine.command.make_command import MakeCommand
from engine.command.move_command import MoveCommand
from engine.database.database import Database
from engine.database.listener_cursor_table import ListenerCursorTable
from engine.database.statement import Statement
from engine.listener.commit_listener import CommitListener
from engine.listener.commit_listener_runner import PLUGIN_RUN_ORDER, CommitListenerRunner
from engine.performance.performance_state import PerformanceState
from engine.dotted_path.dotted_path import DottedPath
from engine.registry.listener_entry import ListenerEntry
from engine.registry.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from tests.unit.core.base.sample_container import sample_container
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_lifecycle import ItemLifecycle
from tests.unit.engine.model.test_model import Item
from engine.change.created import Created
from engine.change.moved import Moved

AGENT = Actor(7, ActorType.AGENT)
HANDLED: list[str] = []


@dataclass(frozen=True)
class ItemPause(MoveCommand[Item]):
    move = ItemLifecycle.pause


class NewItemPause(CommitListener[Created[Item]]):
    """Pauses every new item, which raises an event of its own."""

    name = "items.mark-pause"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Item], logged: LoggedEvent) -> None:
        HANDLED.append(f"pause {logged.row_id}")
        self.bus.run(ItemPause(row_id=logged.row_id), Actor(logged.actor_id, ActorType.MODULE), cause_id=logged.id)


class PausedItemCounter(CommitListener[Moved[Item]]):
    """Counts the items paused."""

    name = "items.paused-count"
    moves = tuple([ItemLifecycle.pause])

    def handle(self, event: Moved[Item], logged: LoggedEvent) -> None:
        HANDLED.append(f"counted {logged.row_id}")


class FailingListener(CommitListener[Created[Item]]):
    """Fails on every event."""

    name = "items.always-fails"

    def handle(self, event: Created[Item], logged: LoggedEvent) -> None:
        HANDLED.append("failed")
        raise RuntimeError("the listener failed")


def entry(listener: type[CommitListener], position: int) -> ListenerEntry:
    return ListenerEntry(listener.name, EventPattern(listener.event), ListenerTiming.COMMIT, DottedPath.class_path(listener), position, 3)


def container_with(tmp_path, *listeners: type[CommitListener]):
    HANDLED.clear()
    pairs = ((MakeCommand, MakeHandler), (MoveCommand, MoveHandler), (EditCommand, EditHandler), (DeleteCommand, DeleteHandler))
    handlers = {DottedPath.class_path(command).text: DottedPath.class_path(handler) for command, handler in pairs}
    registry = Registry("abc", {}, handlers, {}, (), tuple(entry(listener, position) for position, listener in enumerate(listeners, 1)))
    container = sample_container(tmp_path, registry)
    for listener in listeners:
        container.get(ListenerCursorTable).start(listener.name)
    return container


def cursor(container, name: str) -> int:
    return container.get(Database).rows(Statement("SELECT event_id FROM listener_cursors WHERE listener = ?", [name]))[0][0]


def test_a_listener_passes_over_the_events_it_does_not_cover(tmp_path):
    container = container_with(tmp_path, PausedItemCounter)
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert (HANDLED, cursor(container, PausedItemCounter.name)) == ([], 1)


def test_a_listener_writes_one_claim_for_the_event_it_hears_and_one_move_over_the_rest(tmp_path):
    container = container_with(tmp_path, PausedItemCounter)
    bus = container.get(Bus)
    for number in range(20):
        bus.run(MakeItem(title=f"Dune {number}"), AGENT)
    bus.run(ItemPause(row_id=1), AGENT)
    for number in range(20):
        bus.run(MakeItem(title=f"Arrakis {number}"), AGENT)
    counter = container.get(Database).repeated_work
    first_points = counter.points()
    container.get(CommitListenerRunner).run()
    cursor_statements = counter.points().minus(first_points).update_statements
    assert HANDLED == ["counted 1"]
    assert sum(count for statement, count in cursor_statements.items() if "listener_cursors" in statement) == 2
    assert cursor(container, PausedItemCounter.name) == 41


def test_listeners_catch_up_and_follow_a_chain_to_its_end(tmp_path):
    container = container_with(tmp_path, NewItemPause, PausedItemCounter)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["pause 1", "counted 1"]
    assert container.get(EventLog).event(2).cause_id == 1
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["pause 1", "counted 1"]


class UrgentCounter(CommitListener[Created[Item]]):
    """Counts new items before any other listener, and again after each, as a line a person waits on."""

    name = "items.urgent-count"
    run_order = -1

    def handle(self, event: Created[Item], logged: LoggedEvent) -> None:
        HANDLED.append(f"urgent {logged.row_id}")


class PluginCounter(CommitListener[Created[Item]]):
    """Counts new items on the plugin thread."""

    name = "items.plugin-count"
    run_order = PLUGIN_RUN_ORDER

    def handle(self, event: Created[Item], logged: LoggedEvent) -> None:
        HANDLED.append(f"plugin {logged.row_id}")


class SlowCounter(CommitListener[Created[Item]]):
    """Adds an item, which raises an event, while it is the listener at work."""

    name = "items.slow-count"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Item], logged: LoggedEvent) -> None:
        HANDLED.append(f"slow {logged.row_id}")
        if logged.row_id == 1:
            self.bus.run(MakeItem(title="Second"), AGENT)


def test_a_listener_a_person_waits_on_goes_first_and_again_after_each_other_listener(tmp_path):
    container = container_with(tmp_path, SlowCounter, UrgentCounter)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["urgent 1", "slow 1", "urgent 2", "slow 2"]


def test_urgent_listeners_see_events_created_after_a_full_page_in_the_same_round(tmp_path):
    container = container_with(tmp_path, SlowCounter, UrgentCounter)
    for number in range(PAGE_SIZE_EVENTS):
        container.get(Bus).run(MakeItem(title=f"Item {number}"), AGENT)
    runner = container.get(CommitListenerRunner)
    entries = runner.commit_entries()

    runner.run_round(entries, [entry for entry in entries if runner.is_urgent(entry)])

    assert HANDLED[-1] == f"urgent {PAGE_SIZE_EVENTS + 1}"
    assert f"slow {PAGE_SIZE_EVENTS + 1}" not in HANDLED


def test_the_urgent_listeners_and_the_ordinary_ones_run_apart(tmp_path):
    container = container_with(tmp_path, SlowCounter, UrgentCounter)
    runner = container.get(CommitListenerRunner)
    runner.run()
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    runner.run_urgent()
    assert HANDLED == ["urgent 1"]
    runner.run_ordinary()
    assert HANDLED == ["urgent 1", "slow 1", "slow 2"]
    runner.run_urgent()
    assert HANDLED == ["urgent 1", "slow 1", "slow 2", "urgent 2"]


def test_the_plugin_listeners_run_apart_and_a_full_run_still_holds_them(tmp_path):
    container = container_with(tmp_path, PluginCounter, UrgentCounter)
    runner = container.get(CommitListenerRunner)
    runner.run()
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    runner.run_urgent()
    runner.run_ordinary()
    assert HANDLED == ["urgent 1"]
    runner.run_plugin_deliveries()
    assert HANDLED == ["urgent 1", "plugin 1"]
    container.get(Bus).run(MakeItem(title="Arrakis"), AGENT)
    runner.run()
    assert HANDLED == ["urgent 1", "plugin 1", "urgent 2", "plugin 2"]


def test_a_plugin_listener_that_is_behind_leaves_the_start_free_to_finish_and_ordinary_rounds_end(tmp_path, monkeypatch):
    container = container_with(tmp_path, PluginCounter, UrgentCounter)
    runner = container.get(CommitListenerRunner)
    runner.run()
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    state = container.get(PerformanceState)
    state.keep_boot_event(container.get(EventLog).newest_id())
    runner.run_urgent()
    rounds: list[int] = []
    run_round = runner.run_round
    monkeypatch.setattr(runner, "run_round", lambda entries, urgent_entries: rounds.append(1) or run_round(entries, urgent_entries))
    runner.run_ordinary()
    assert not state.starting.exists()
    assert len(rounds) == 1
    assert cursor(container, PluginCounter.name) < cursor(container, UrgentCounter.name)


def test_a_listener_with_nothing_to_handle_does_not_run_the_urgent_listeners_again(tmp_path, monkeypatch):
    container = container_with(tmp_path, UrgentCounter, PausedItemCounter)
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    runner = container.get(CommitListenerRunner)
    runner.run()
    listeners_read: list[str] = []
    position = ListenerCursorTable.position
    monkeypatch.setattr(ListenerCursorTable, "position", lambda table, name: (listeners_read.append(name), position(table, name))[1])
    urgent, counter = sorted((entry for entry in runner.registry.listeners), key=runner.run_order)
    runner.run_entry(counter, [urgent], [])
    assert listeners_read == []


def test_an_event_that_fails_three_times_is_skipped_and_the_listener_goes_on(tmp_path):
    container = container_with(tmp_path, FailingListener)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
    for _ in range(3):
        container.get(CommitListenerRunner).run()
    assert HANDLED == ["failed", "failed", "failed"]
    assert cursor(container, FailingListener.name) == 1
    assert container.get(Database).rows(Statement("SELECT failures FROM listener_skips"))[0][0] == 3


def test_a_runner_that_read_an_old_position_cannot_claim_an_event_another_runner_took(tmp_path):
    container = container_with(tmp_path, PausedItemCounter)
    container.get(Bus).run(MakeItem(title="Dune"), AGENT)
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
