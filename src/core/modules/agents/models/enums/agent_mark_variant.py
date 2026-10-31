from enum import StrEnum


class AgentMarkVariant(StrEnum):
    """What happened to a subagent, as its mark says it."""

    STARTED = "started"
    ENDED = "ended"
