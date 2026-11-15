from enum import StrEnum


class WakeMove(StrEnum):
    """What a step did to an agent's wake obligation."""

    UNCHANGED = "unchanged"
    WRITTEN = "written"
    MERGED = "merged"
    INHIBITED = "inhibited"
    ACKNOWLEDGED = "acknowledged"
    CANCELLED = "cancelled"
