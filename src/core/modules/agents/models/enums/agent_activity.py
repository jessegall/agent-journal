from enum import StrEnum


class AgentActivity(StrEnum):
    """What an agent is doing, as one word a button condition can test: it works, it is held, it waits at its
    program's usage limit, or its session ended."""

    WORKING = "working"
    PAUSED = "paused"
    USAGE_LIMITED = "at usage limit"
    ENDED = "ended"
