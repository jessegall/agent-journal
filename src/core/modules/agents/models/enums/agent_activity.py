from enum import StrEnum


class AgentActivity(StrEnum):
    """What an agent is doing, as one word a button condition can test: it works, it is held, or its session ended."""

    WORKING = "working"
    PAUSED = "paused"
    ENDED = "ended"
