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
from core.base.database.statement import Statement
from core.base.listener.commit_listener import CommitListener
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.registry.dotted_path import DottedPath
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry
from tests.core.base.harness import harness
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_lifecycle import LoanLifecycle
from tests.core.base.test_model import Loan

AGENT = Actor(7, ActorType.AGENT)
HANDLED: list[str] = []


@dataclass(frozen=True)
class LoanOverdue(MoveCommand[Loan]):
    move = LoanLifecycle.overdue


class MarkNewLoansOverdue(CommitListener):
    """Moves every new loan to overdue, which raises an event of its own."""

    name = "loans.mark-overdue"
    event = "loan.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        HANDLED.append(f"overdue {event.row_id}")
        self.bus.run(LoanOverdue(row_id=event.row_id), Actor(event.actor_id, ActorType.MODULE), cause_id=event.id)


class CountOverdue(CommitListener):
    """Counts loans that went overdue."""

    name = "loans.count-overdue"
    event = "loan.overdue"

    def handle(self, event: LoggedEvent) -> None:
        HANDLED.append(f"counted {event.row_id}")


class AlwaysFails(CommitListener):
    """Fails on every event."""

    name = "loans.always-fails"
    event = "loan.create"

    def handle(self, event: LoggedEvent) -> None:
        HANDLED.append("failed")
        raise RuntimeError("the reader is away")


def entry(listener: type[CommitListener], position: int) -> ListenerEntry:
    return ListenerEntry(listener.name, EventPattern(listener.event), ListenerTiming.COMMIT, DottedPath.class_path(listener), position, 3)


def container_with(tmp_path, *listeners: type[CommitListener]):
    HANDLED.clear()
    pairs = ((MakeCommand, MakeHandler), (MoveCommand, MoveHandler), (EditCommand, EditHandler), (DeleteCommand, DeleteHandler))
    handlers = {DottedPath.class_path(command).text: DottedPath.class_path(handler) for command, handler in pairs}
    registry = Registry("abc", {}, handlers, {}, (), tuple(entry(listener, position) for position, listener in enumerate(listeners, 1)))
    return harness(tmp_path, registry)


def cursor(container, name: str) -> int:
    return container.get(Database).rows(Statement("SELECT event_id FROM listener_cursors WHERE listener = ?", (name,)))[0][0]


def test_a_new_listener_starts_at_the_newest_event_and_replays_nothing(tmp_path):
    container = container_with(tmp_path, CountOverdue)
    container.get(Bus).run(LoanMake(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert (HANDLED, cursor(container, CountOverdue.name)) == ([], 1)


def test_listeners_catch_up_and_follow_a_chain_to_its_end(tmp_path):
    container = container_with(tmp_path, MarkNewLoansOverdue, CountOverdue)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(LoanMake(title="Dune"), AGENT)
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["overdue 1", "counted 1"]
    assert container.get(EventLog).event(2).cause_id == 1
    container.get(CommitListenerRunner).run()
    assert HANDLED == ["overdue 1", "counted 1"]


def test_an_event_that_fails_three_times_is_skipped_and_the_listener_goes_on(tmp_path):
    container = container_with(tmp_path, AlwaysFails)
    container.get(CommitListenerRunner).run()
    container.get(Bus).run(LoanMake(title="Dune"), AGENT)
    for _ in range(3):
        container.get(CommitListenerRunner).run()
    assert HANDLED == ["failed", "failed", "failed"]
    assert cursor(container, AlwaysFails.name) == 1
    assert container.get(Database).rows(Statement("SELECT failures FROM listener_skips"))[0][0] == 3


@pytest.mark.parametrize("runs", [1, 2])
def test_running_again_with_nothing_new_handles_nothing(tmp_path, runs: int):
    container = container_with(tmp_path, CountOverdue)
    for _ in range(runs):
        container.get(CommitListenerRunner).run()
    assert HANDLED == []
