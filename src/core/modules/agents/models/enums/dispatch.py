from enum import StrEnum


class Dispatch(StrEnum):
    """What a request to start an agent's program came to: it was started, a program of the agent runs already,
    another start of the same session is under way, the launcher could not start it, or it may not start now."""

    STARTED = "started"
    RUNNING = "running"
    LOCKED = "locked"
    FAILED = "failed"
    REFUSED = "refused"
