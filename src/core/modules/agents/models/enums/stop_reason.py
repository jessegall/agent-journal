from enum import StrEnum


class StopReason(StrEnum):
    """Who had an agent's program stopped; the text is what a user reads as the reason the agent ended."""

    PERSON = "stopped by a user"
    AGENT = "stopped by an agent"
    JOURNAL = "stopped by the journal"
