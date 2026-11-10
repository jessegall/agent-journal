from enum import StrEnum


class LaunchAnswer(StrEnum):
    """What the launcher did with an agent's program: started it, found one of its programs still open, or did
    not start it. Locked down means the program is at a usage limit: nothing was asked of the launcher and nothing
    failed, so the caller tries again later."""

    STARTED = "started"
    RUNNING = "running"
    FAILED = "failed"
    LOCKED = "locked"
    SKIPPED = "skipped"
    LOCKED_DOWN = "locked_down"
