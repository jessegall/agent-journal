from enum import StrEnum


class LaunchAnswer(StrEnum):
    """What the launcher did with an agent's program: started it, found one of its programs still open, or did
    not start it."""

    STARTED = "started"
    RUNNING = "running"
    FAILED = "failed"
    LOCKED = "locked"
    NOT_ASKED = "not asked"
