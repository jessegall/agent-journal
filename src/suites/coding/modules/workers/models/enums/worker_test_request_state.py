from enum import StrEnum


class WorkerTestRequestState(StrEnum):
    """Where a request to run one test stands: requested, allowed, used by the run, allowed again when the run
    stopped before it started, or refused."""

    REQUESTED = "requested"
    ALLOWED = "allowed"
    USED = "used"
    REFUSED = "refused"


OPEN_REQUEST_STATES = (WorkerTestRequestState.REQUESTED, WorkerTestRequestState.ALLOWED)
