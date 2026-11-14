from collections.abc import Callable
from datetime import datetime, timedelta, timezone

from engine.time.clock import Clock
from engine.time.timestamp import Timestamp

STORY_START = datetime(2026, 10, 31, 9, tzinfo=timezone.utc)


class ManualClock(Clock):
    """A clock that stands still until a story moves it, so stories never wait for real time."""

    def __init__(self) -> None:
        self.current = STORY_START
        self.slept_seconds = 0.0
        self.sleeps = 0
        self.calls: dict[int, Callable[[], None]] = {}

    def timestamp(self) -> Timestamp:
        return Timestamp(self.current)

    def advance(self, duration: timedelta) -> None:
        self.current += duration

    def sleep(self, seconds: float) -> None:
        self.advance(timedelta(seconds=seconds))
        self.slept_seconds += seconds
        self.sleeps += 1
        call = self.calls.pop(self.sleeps, None)
        if call is not None:
            call()

    def call_after_sleeps(self, sleeps: int, call: Callable[[], None]) -> None:
        self.calls[self.sleeps + sleeps] = call
