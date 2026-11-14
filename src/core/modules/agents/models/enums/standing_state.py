from enum import StrEnum


class StandingState(StrEnum):
    """Where an agent's program is in its life, as the dispatcher works it out."""

    UNSTARTED = "never_started"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    ENDED = "ended"
    FAILED = "failed"
