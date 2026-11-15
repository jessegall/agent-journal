from dataclasses import dataclass

from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class GivenWakeLine:
    """A line given to a wake waiter and not yet confirmed: the waiter's token and when the line was given."""

    token: str
    given_at: Timestamp
