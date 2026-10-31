from enum import StrEnum


class ProcessMarkVariant(StrEnum):
    """Where the run a mark follows stands."""

    RUNNING = "running"
    BACKGROUND = "background"
    FINISHED = "finished"
    FAILED = "failed"
    STOPPED = "stopped"
    LOST = "lost"
