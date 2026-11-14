from enum import StrEnum


class AgentMarkVariant(StrEnum):
    """What happened to a helper, a menu in its terminal or a launcher, as its mark says it."""

    STARTED = "started"
    ENDED = "ended"
    ANSWERED = "answered"
    STOPPED = "stopped"
