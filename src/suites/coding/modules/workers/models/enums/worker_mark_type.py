from enum import StrEnum


class WorkerMarkType(StrEnum):
    """The chat mark types the workers module adds."""

    TESTS = "workers.tests"
    WORKER = "workers.worker"

    SPLIT = "workers.split"
