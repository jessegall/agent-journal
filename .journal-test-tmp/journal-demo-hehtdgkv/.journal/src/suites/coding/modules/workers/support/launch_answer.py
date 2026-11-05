from enum import StrEnum


class LaunchAnswer(StrEnum):
    """What the launcher did with a worker's program: started it, found one of the worker's programs still
    open, or did not start it."""

    STARTED = "started"
    RUNNING = "running"
    FAILED = "failed"
