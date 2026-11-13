import itertools
import threading
from collections.abc import Callable

from engine.database.write_turns import WriteTurns
from engine.execution.current_execution import CurrentExecution
from engine.time.clock import Clock
from server.errors.write_turn_busy_error import WriteTurnBusyError
from server.execution.waiting_ask import WaitingAsk

SLOW_HOLD_SECONDS = 1.0


class WriteTurnQueue(WriteTurns):
    """The server's one write turn, handed to one thread at a time: the highest priority first, then the one that
    asked first. An ask that waits its step is raised one step, never to immediate. A holder whose thread died gives
    the turn back; a wait past the limit names the holder; a holder over a second is written to the log."""

    def __init__(self, clock: Clock, wait_limit_seconds: float, log_slow_hold: Callable[[str], None]) -> None:
        super().__init__()
        self.clock, self.wait_limit_seconds, self.log_slow_hold = clock, wait_limit_seconds, log_slow_hold
        self.changed = threading.Condition()
        self.numbers = itertools.count()
        self.waiting: list[WaitingAsk] = []
        self.holder: WaitingAsk | None = None
        self.held_since = 0.0

    def take(self) -> None:
        execution = CurrentExecution.read()
        now = self.clock.epoch_seconds()
        ask = WaitingAsk(execution, execution.priority, next(self.numbers), threading.current_thread(), now, now)
        with self.changed:
            self.waiting.append(ask)
            try:
                self.wait_for_turn(ask)
            finally:
                self.waiting.remove(ask)
                self.changed.notify_all()
            self.holder, self.held_since = ask, self.clock.epoch_seconds()

    def wait_for_turn(self, ask: WaitingAsk) -> None:
        while True:
            now = self.clock.epoch_seconds()
            if self.holder is not None and not self.holder.thread.is_alive():
                self.holder = None
            for waiting in self.waiting:
                waiting.raise_when_due(now)
            if self.holder is None and ask is min(self.waiting, key=lambda waiting: waiting.place):
                return
            waited = now - ask.asked_at
            if waited >= self.wait_limit_seconds and not ask.priority.is_unlimited:
                raise WriteTurnBusyError.held_by(self.holder.described() if self.holder is not None else "an earlier ask", waited)
            self.changed.wait(min(self.wait_limit_seconds - waited, min(waiting.seconds_to_raise(now) for waiting in self.waiting)))

    def give_back(self) -> None:
        with self.changed:
            holder, held = self.holder, self.clock.epoch_seconds() - self.held_since
            self.holder = None
            self.changed.notify_all()
        if holder is not None and held > SLOW_HOLD_SECONDS:
            self.log_slow_hold(f"the database write turn was held {held:.1f} seconds by {holder.described()}")

    # a test that moves a hand-set clock asks the waiting threads to look at it again
    def wake_waiters(self) -> None:
        with self.changed:
            self.changed.notify_all()
