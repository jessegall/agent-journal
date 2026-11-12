from enum import StrEnum


class AgentActivity(StrEnum):
    """What an agent is doing, as one word a button condition can test: it works, it is held, it waits at its
    program's usage limit, a hook of it was stopped at that limit, or its session ended. Halted comes before
    paused: a stopped agent does nothing whether or not a person also paused it."""

    WORKING = "working"
    PAUSED = "paused"
    USAGE_LIMITED = "at usage limit"
    HALTED = "halted"
    ENDED = "ended"
