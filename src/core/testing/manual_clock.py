from datetime import datetime, timedelta, timezone

from core.base.clock import Clock
from core.base.moment import Moment

STORY_START = datetime(2026, 10, 31, 9, tzinfo=timezone.utc)


class ManualClock(Clock):
    """A clock that stands still until a story moves it, so stories never wait for real time."""

    def __init__(self) -> None:
        self.current = STORY_START

    def moment(self) -> Moment:
        return Moment(self.current)

    def advance(self, duration: timedelta) -> None:
        self.current += duration
