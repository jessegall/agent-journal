import threading
import time
from collections.abc import Callable
from datetime import datetime, timezone

from engine.execution.held_write_turn import HELD_WRITE_TURN
from engine.time.timestamp import Timestamp


class Clock:
    """Gives the current time and waits, for a number of seconds or by looking again and again whether something
    has happened; tests replace it with a clock they set by hand."""

    def timestamp(self) -> Timestamp:
        return Timestamp(datetime.now(timezone.utc))

    def epoch_seconds(self) -> float:
        return self.timestamp().value.timestamp()

    def sleep(self, seconds: float) -> None:
        HELD_WRITE_TURN.refuse_wait(f"a sleep of {seconds} seconds")
        time.sleep(seconds)

    def join(self, thread: threading.Thread, limit_seconds: float | None = None) -> None:
        HELD_WRITE_TURN.refuse_wait(f"the end of thread {thread.name}")
        thread.join(limit_seconds)

    def poll(self, has_happened: Callable[[], bool], limit_seconds: float, pause_seconds: float) -> bool:
        HELD_WRITE_TURN.refuse_wait("a poll")
        ends_at = self.epoch_seconds() + limit_seconds
        while not has_happened():
            if self.epoch_seconds() >= ends_at:
                return False
            self.sleep(pause_seconds)
        return True
