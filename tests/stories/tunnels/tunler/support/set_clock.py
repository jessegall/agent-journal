from datetime import datetime, timedelta, timezone

from core.base.clock import Clock
from core.base.timestamp import Timestamp


class SetClock(Clock):
    """A clock a story moves by hand."""

    def __init__(self) -> None:
        self.now = datetime(2026, 10, 31, 12, 0, tzinfo=timezone.utc)

    def timestamp(self) -> Timestamp:
        return Timestamp(self.now)

    def move(self, seconds: float) -> None:
        self.now += timedelta(seconds=seconds)
