from dataclasses import dataclass

from engine.driver.interval import Interval


@dataclass(frozen=True)
class ReminderDeclaration:
    """A reminder that repeats on an interval of time and closed tasks. It may pass unanswered the allowed number of
    times; the next time it comes with nothing it names having moved, it holds the agent until answered."""

    key: str
    interval: Interval
    allowed_passes: int
