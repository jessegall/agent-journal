from enum import StrEnum


class WaitState(StrEnum):
    """Whether a wait holds the agent or has ended."""

    OPEN = "open"
    ENDED = "ended"
