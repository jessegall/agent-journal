from enum import StrEnum


class CheckpointState(StrEnum):
    """How the run of a reached checkpoint stands: its tests run, they passed, or they failed."""

    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
