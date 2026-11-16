import threading
import time
from collections.abc import Callable
from datetime import datetime, timezone

from engine.time.thread_turn_count import THREAD_TURN_COUNT
from engine.time.timestamp import Timestamp


class Clock:
    """Gives the current time and waits, for a number of seconds or by looking again and again whether something
    has happened; tests replace it with a clock they set by hand."""

    def timestamp(self) -> Timestamp:
        return Timestamp(datetime.now(timezone.utc))

    def unix_seconds(self) -> float:
        return self.timestamp().value.timestamp()

    def sleep(self, seconds: float) -> None:
        THREAD_TURN_COUNT.refuse_wait(f"a sleep of {seconds} seconds")
        time.sleep(seconds)

    def join(self, thread: threading.Thread, limit_seconds: float | None = None) -> None:
        THREAD_TURN_COUNT.refuse_wait(f"the end of thread {thread.name}")
        thread.join(limit_seconds)

    def poll(self, has_happened: Callable[[], bool], limit_seconds: float, pause_seconds: float) -> bool:
        ends_at = self.unix_seconds() + limit_seconds
        while not has_happened():
            if self.unix_seconds() >= ends_at:
                return False
            self.sleep(pause_seconds)
        return True
