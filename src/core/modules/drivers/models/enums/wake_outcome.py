from enum import StrEnum


class WakeOutcome(StrEnum):
    """How a wake waiter's wait ended: a line was given to it, nothing came in its time, or it was cancelled."""

    GIVEN = "given"
    NOTHING = "nothing"
    CANCELLED = "cancelled"
