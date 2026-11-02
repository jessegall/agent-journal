from enum import StrEnum


class WorkerMarkVariant(StrEnum):
    """What a worker's tests mark says: its tests are queued, all passed, or some failed."""

    QUEUED = "queued"
    PASSED = "passed"
    FAILED = "failed"
