from engine.time.thread_turn_count import THREAD_TURN_COUNT
import itertools
import threading
from collections.abc import Callable, Generator
from contextlib import contextmanager
from dataclasses import replace

from engine.execution.execution_order import ExecutionOrder
from engine.execution.execution_ticket import ExecutionTicket
from engine.time.clock import Clock
from server.errors.client_gone_error import ClientGoneError
from server.errors.pool_busy_error import PoolBusyError
from server.execution.instant_entry import InstantEntry

from server.execution.tickets.queued_ticket import QueuedTicket
RECHECK_SECONDS = 0.5


class ExecutionQueue:
    """The server's instant lane, kept in memory: a hook, command or viewer request starts when the one
    decision gives it room, the immediate ones at once; a session runs one of the tickets it owns at a time, in
    the order it asked (its hooks own one, its commands none); a ticket leaves the lane on any exit, an exception included, and when its client has gone; a
    wait past its limit is refused, naming what held the lane."""

    def __init__(self, order: ExecutionOrder, clock: Clock, crash_log: Callable[[str], None] = lambda text: None) -> None:
        self.order, self.clock, self.crash_log = order, clock, crash_log
        self.changed = threading.Condition()
        self.numbers = itertools.count()
        self.waiting: list[QueuedTicket] = []
        self.running: list[QueuedTicket] = []

    @contextmanager
    def admitted(self, ticket: ExecutionTicket, owner: str = "", wait_limit_seconds: float | None = None,
                 is_client_waiting: Callable[[], bool] = lambda: True) -> Generator[QueuedTicket]:
        number = next(self.numbers)
        queued = QueuedTicket(number, replace(ticket, run_id=number), owner, self.clock.unix_seconds(), is_client_waiting)
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
        except Exception as error:
            self.crash_log(f"{self.entry(queued, True).described} ended with {type(error).__name__}: {error}")
            raise
        finally:
            with self.changed:
                self.running.remove(queued)
                self.changed.notify_all()

    def wait_start(self, queued: QueuedTicket, wait_limit_seconds: float | None) -> None:
        wait_limit = None if queued.ticket.priority.is_unlimited else wait_limit_seconds
        while not self.can_start(queued):
            if not queued.is_client_waiting():
                raise ClientGoneError(queued.ticket.line)
            THREAD_TURN_COUNT.refuse_wait(f"the wait for an instant lane place for {queued.ticket.line}")
            waited = self.clock.unix_seconds() - queued.entered_at
            if wait_limit is not None and waited >= wait_limit:
                raise PoolBusyError.waited(waited, self.holders())
            self.changed.wait(RECHECK_SECONDS if wait_limit is None else min(RECHECK_SECONDS, wait_limit - waited))

    # a waited child starts at once, since its parent holds its place; a session's tickets go one at a time and in
    # the order they asked; of the rest the one decision picks
    def can_start(self, queued: QueuedTicket) -> bool:
        if queued.ticket.parent is not None:
            return True
        busy_owners = {running.owner for running in self.running if running.owner}
        earliest_owner = {}
        for waiting in self.waiting:
            earliest_owner.setdefault(waiting.owner, waiting)
        eligible = [waiting for waiting in self.waiting if not waiting.owner or (waiting.owner not in busy_owners and earliest_owner[waiting.owner] is waiting)]
        if queued not in eligible:
            return False
        starting = self.order.starting([waiting.ticket for waiting in eligible], [running.ticket for running in self.running], self.clock.timestamp(), False)
        return any(ticket.run_id == queued.number for ticket in starting)

    def holders(self) -> list[str]:
        return [self.entry(running, True).described for running in self.running]

    def read(self) -> tuple[InstantEntry, ...]:
        with self.changed:
            return (*(self.entry(running, True) for running in self.running), *(self.entry(waiting, False) for waiting in self.waiting))

    def entry(self, queued: QueuedTicket, is_running: bool) -> InstantEntry:
        return InstantEntry(queued.number, is_running, queued.ticket, queued.owner, self.clock.unix_seconds() - queued.entered_at)

    # a stop waits this long for the running tickets to end
    def wait_idle(self, limit_seconds: float) -> bool:
        with self.changed:
            return self.changed.wait_for(lambda: not self.running, limit_seconds)

