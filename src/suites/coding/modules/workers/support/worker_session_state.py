from enum import StrEnum


class WorkerSessionState(StrEnum):
    """Whether a worker session can start another process."""

    READY = "ready"
    RUNNING = "running"
    BLOCKED = "blocked"
