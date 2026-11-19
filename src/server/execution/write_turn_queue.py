import itertools
import sys
import threading
from types import FrameType
import traceback
from collections.abc import Callable

from engine.database.write_turns import WriteTurns
from engine.execution.current_execution import CurrentExecution
from engine.time.clock import Clock
from server.errors.write_turn_busy_error import WriteTurnBusyError
from server.execution.waiting_ask import WaitingAsk

SLOW_TURN_SECONDS = 1.0
HOLDER_CHECK_SECONDS = 1.0
# a hold this long has its holder's stack logged once, so each slow hold names the code that made it
SLOW_HOLD_SECONDS = 3.0
OTHER_THREAD_FRAMES = 6


class WriteTurnQueue(WriteTurns):
    """The server's one write turn, handed to one thread at a time: the highest priority first, then the one
    that asked first. An ask that waits its step is raised one step, never to immediate. A holder whose thread
    died gives the turn back; a wait past the limit names the holder and writes to the log, once for each holder,
    the thread that holds it and where that thread stands, so a turn that is never given back shows its cause;
    a slow holder is written to the log."""

    def __init__(self, clock: Clock, wait_limit_seconds: float, slow_turn_log: Callable[[str], None]) -> None:
        super().__init__()
        self.clock, self.wait_limit_seconds, self.slow_turn_log = clock, wait_limit_seconds, slow_turn_log
        self.changed = threading.Condition()
        self.numbers = itertools.count()
        self.waiting: list[WaitingAsk] = []
        self.holder: WaitingAsk | None = None
        self.turn_started_at = 0.0
        self.shown_holder_number = -1

    def acquire(self) -> None:
        execution = CurrentExecution.read()
        current_time = self.clock.unix_seconds()
        new_question = WaitingAsk(execution, execution.priority, next(self.numbers), threading.current_thread(), current_time, current_time)
        with self.changed:
            self.waiting.append(new_question)
            try:
                self.wait_turn(new_question)
            finally:
                self.waiting.remove(new_question)
                self.changed.notify_all()
            self.holder, self.turn_started_at = new_question, self.clock.unix_seconds()

    def wait_turn(self, new_question: WaitingAsk) -> None:
        while True:
            current_time = self.clock.unix_seconds()
            if self.holder is not None and not self.holder.thread.is_alive():
                self.holder = None
            for waiting in self.waiting:
                waiting.raise_priority(current_time)
            if self.holder is None and new_question is min(self.waiting, key=lambda waiting: waiting.place):
                return
            held = current_time - self.turn_started_at if self.holder is not None else 0.0
            if held >= SLOW_HOLD_SECONDS:
                self.show_stuck_holder(current_time)
            waited = current_time - new_question.requested_at
            if waited >= self.wait_limit_seconds and not new_question.priority.is_unlimited:
                self.show_stuck_holder(current_time)
                raise WriteTurnBusyError.waited(waited, [self.holder_text()])
            # an unlimited ask looks again each second for a holder whose thread died, never a negative time that spins
            limit_delay = HOLDER_CHECK_SECONDS if new_question.priority.is_unlimited else self.wait_limit_seconds - waited
            # a waiter wakes when the hold turns slow, so a slow holder's stack is logged while it still holds
            slow_delay = SLOW_HOLD_SECONDS - held if self.holder is not None and held < SLOW_HOLD_SECONDS else limit_delay
            self.changed.wait(min(limit_delay, slow_delay, min(waiting.raise_delay(current_time) for waiting in self.waiting)))

    def show_stuck_holder(self, current_time: float) -> None:
        holder = self.holder
        if holder is None or holder.number == self.shown_holder_number:
            return
        self.shown_holder_number = holder.number
        frames = sys._current_frames()
        frame = frames.get(holder.thread.ident or 0)
        where = "".join(traceback.format_stack(frame)) if frame is not None else "its thread shows no frame"
        self.slow_turn_log(f"the database write turn is held {current_time - self.turn_started_at:.1f} seconds by {holder.described()} on thread {holder.thread.name}, which stands at:\n{where}"
                           f"while the other threads stand at:\n{self.other_threads(frames, holder.thread.ident or 0)}")

    # the last frames of every other thread, as a holder that does almost nothing is slow when another thread holds the CPU
    @staticmethod
    def other_threads(frames: dict[int, FrameType], holder_ident: int) -> str:
        names = {thread.ident: thread.name for thread in threading.enumerate()}
        return "".join(f"[{names.get(ident, ident)}]\n" + "".join(traceback.format_stack(frame)[-OTHER_THREAD_FRAMES:])
                       for ident, frame in frames.items() if ident != holder_ident)

    # the ask that holds the turn, or, between two holders, the earlier ask the turn goes to next
    def holder_text(self) -> str:
        first = self.holder or min(self.waiting, key=lambda waiting: waiting.place)
        return first.described()

    def release(self) -> None:
        with self.changed:
            holder, turn_seconds = self.holder, self.clock.unix_seconds() - self.turn_started_at
            self.holder = None
            self.changed.notify_all()
        if holder is not None and turn_seconds > SLOW_TURN_SECONDS:
            self.slow_turn_log(f"the database write turn was held {turn_seconds:.1f} seconds by {holder.described()}, {self.depth.statements} statements")

    # a test that moves a hand-set clock asks the waiting threads to look at it again
    def wake_waiters(self) -> None:
        with self.changed:
            self.changed.notify_all()
