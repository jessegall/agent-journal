from enum import StrEnum


class QueuedRunState(StrEnum):
    """Where a run a plugin queued stands: waiting for its place, running, ended by itself, stopped at its
    timeout, or cancelled."""

    WAITING = "waiting"
    RUNNING = "running"
    ENDED = "ended"
    TIMED_OUT = "timed-out"
    CANCELLED = "cancelled"

    @property
    def is_over(self) -> bool:
        return self in (QueuedRunState.ENDED, QueuedRunState.TIMED_OUT, QueuedRunState.CANCELLED)
