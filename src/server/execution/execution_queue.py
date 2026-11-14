from engine.execution.held_write_turn import HELD_WRITE_TURN
import itertools
import threading
from collections.abc import Callable, Generator
from contextlib import contextmanager
from dataclasses import dataclass, replace

from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from server.errors.client_left_error import ClientLeftError
from server.errors.hook_database_busy_error import HookDatabaseBusyError
from server.execution.instant_entry import InstantEntry

LOOK_AGAIN_SECONDS = 0.5


@dataclass
class QueuedTicket:
    """A ticket in the instant lane with its place, the session that owns it and whether its client still waits."""

    number: int
    ticket: ExecutionTicket
    owner: str
    entered_at: float
    is_client_waiting: Callable[[], bool]


class ExecutionQueue:
    """The server's instant lane, kept in memory: a hook, command or viewer request starts when the one decision
    gives it room, the immediate ones at once; a session runs one ticket at a time, in the order it asked; a ticket
    leaves the lane on any exit, an exception included, and when its client has gone; a wait past its limit is
    refused, naming what held the lane."""

    def __init__(self, order: ExecutionOrder, clock: Clock) -> None:
        self.order, self.clock = order, clock
        self.changed = threading.Condition()
        self.numbers = itertools.count()
        self.waiting: list[QueuedTicket] = []
        self.running: list[QueuedTicket] = []

    @contextmanager
    def admitted(self, ticket: ExecutionTicket, owner: str = "", wait_limit_seconds: float | None = None,
                 is_client_waiting: Callable[[], bool] = lambda: True) -> Generator[QueuedTicket]:
        number = next(self.numbers)
        queued = QueuedTicket(number, replace(ticket, run_id=number), owner, self.clock.epoch_seconds(), is_client_waiting)
        with self.changed:
            self.waiting.append(queued)
            try:
                self.wait_start(queued, wait_limit_seconds)
            finally:
                self.waiting.remove(queued)
                self.changed.notify_all()
            self.running.append(queued)
        try:
            yield queued
        finally:
            with self.changed:
                self.running.remove(queued)
                self.changed.notify_all()

    def wait_start(self, queued: QueuedTicket, wait_limit_seconds: float | None) -> None:
        while not self.starts_now(queued):
            if not queued.is_client_waiting():
                raise ClientLeftError(queued.ticket.line)
            HELD_WRITE_TURN.refuse_wait(f"the wait for an instant lane place for {queued.ticket.line}")
            waited = self.clock.epoch_seconds() - queued.entered_at
            if wait_limit_seconds is not None and waited >= wait_limit_seconds and not queued.ticket.priority.is_unlimited:
                raise HookDatabaseBusyError(f"the journal was busy for {waited:.1f} seconds: waiting for {self.holders_text()}")
            self.changed.wait(LOOK_AGAIN_SECONDS if wait_limit_seconds is None else max(0.0, min(LOOK_AGAIN_SECONDS, wait_limit_seconds - waited)))

    # a session's tickets go one at a time and in the order they asked; of the rest the one decision picks
    def starts_now(self, queued: QueuedTicket) -> bool:
        busy_owners = {running.owner for running in self.running if running.owner}
        first_of_owner = {}
        for waiting in self.waiting:
            first_of_owner.setdefault(waiting.owner, waiting)
        eligible = [waiting for waiting in self.waiting if not waiting.owner or (waiting.owner not in busy_owners and first_of_owner[waiting.owner] is waiting)]
        if queued not in eligible:
            return False
        starting = self.order.starting([waiting.ticket for waiting in eligible], [running.ticket for running in self.running], self.clock.timestamp(), False)
        return any(ticket.run_id == queued.number for ticket in starting)

    def holders_text(self) -> str:
        holders = [self.entry(running, True).described for running in self.running]
        return "; ".join(holders) or "nothing running, so the lane is full of waiting tickets"

    def read(self) -> tuple[InstantEntry, ...]:
        with self.changed:
            return (*(self.entry(running, True) for running in self.running), *(self.entry(waiting, False) for waiting in self.waiting))

    def entry(self, queued: QueuedTicket, is_running: bool) -> InstantEntry:
        return InstantEntry(queued.number, is_running, queued.ticket, queued.owner, self.clock.epoch_seconds() - queued.entered_at)

    # a stop waits this long for the running tickets to end
    def wait_idle(self, limit_seconds: float) -> bool:
        with self.changed:
            return self.changed.wait_for(lambda: not self.running, limit_seconds)

