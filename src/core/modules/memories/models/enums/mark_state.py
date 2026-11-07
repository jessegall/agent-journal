from enum import StrEnum


class MarkState(StrEnum):
    """Whether a context mark still waits for the agent, or the agent weighed a memory or skipped it."""

    OPEN = "open"
    WEIGHED = "weighed"
    SKIPPED = "skipped"
