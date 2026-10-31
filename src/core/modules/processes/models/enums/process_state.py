from enum import StrEnum


class ProcessState(StrEnum):
    """Where a run stands: running in the foreground, moved to the background, finished, failed, stopped by a
    person or an agent, or lost when its shell is gone without an end."""

    RUNNING = "running"
    BACKGROUND = "background"
    FINISHED = "finished"
    FAILED = "failed"
    STOPPED = "stopped"
    ORPHANED = "orphaned"
