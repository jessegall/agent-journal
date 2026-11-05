from enum import StrEnum


class PartState(StrEnum):
    """Where one part of a run's line stands."""

    WAITING = "waiting"
    RUNNING = "running"
    FINISHED = "finished"
    FAILED = "failed"
