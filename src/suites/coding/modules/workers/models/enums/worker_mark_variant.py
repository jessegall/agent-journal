from enum import StrEnum


class WorkerMarkVariant(StrEnum):
    """What a worker's mark says: its tests are queued, all passed or some failed; or a move or a stop of
    the worker itself."""

    QUEUED = "queued"
    PASSED = "passed"
    FAILED = "failed"
    STARTED = "started"
    NEXT_TASK = "next task"
    DELIVERED = "delivered"
    MERGED = "merged"
    RELEASED = "released"
    ENDED_EARLY = "ended early"
    HELP_REQUEST = "help request"
