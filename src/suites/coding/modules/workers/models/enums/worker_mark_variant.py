from enum import StrEnum


class WorkerMarkVariant(StrEnum):
    """What a worker's mark says: its tests are queued, all passed or some failed; or a move, a job or a plan
    handed to the worker, or a stop of it."""

    QUEUED = "queued"
    PASSED = "passed"
    FAILED = "failed"
    STARTED = "started"
    NEXT_TASK = "next task"
    NEXT_JOB = "next job"
    HANDED_PLAN = "handed plan"
    DELIVERED = "delivered"
    MERGED = "merged"
    RELEASED = "released"
    ENDED_EARLY = "ended early"
    HELP_REQUEST = "help request"
    TEST_REQUEST = "test request"
    TEST_ALLOWED = "test allowed"
