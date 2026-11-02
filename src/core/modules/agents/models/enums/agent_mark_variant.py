from enum import StrEnum


class AgentMarkVariant(StrEnum):
    """What happened to a subagent or a menu in its terminal, as its mark says it."""

    STARTED = "started"
    ENDED = "ended"
    ANSWERED = "answered"
