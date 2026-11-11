from enum import StrEnum


class FailedTestSource(StrEnum):
    """Where a worker's failed test ran: in the journal's run of a hand-in, or in the worker's own run."""

    DELIVERY = "delivery"
    WORKER_RUN = "worker_run"
