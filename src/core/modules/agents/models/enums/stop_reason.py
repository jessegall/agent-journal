from enum import StrEnum


class StopReason(StrEnum):
    """Who had an agent's program stopped; the text is what a person reads as the reason the agent ended."""

    PERSON = "stopped by a person"
    AGENT = "stopped by an agent"
    JOURNAL = "stopped by the journal"
