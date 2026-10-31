from enum import StrEnum


class WaitType(StrEnum):
    """What a wait is for: rows the agent waits on, or a report that the agent is stuck."""

    ROWS = "rows"
    IMPASSE = "impasse"
