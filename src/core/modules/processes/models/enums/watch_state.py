from enum import StrEnum


class WatchState(StrEnum):
    """Whether an agent still watches a process."""

    OPEN = "open"
    ENDED = "ended"
