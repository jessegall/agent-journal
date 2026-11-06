from enum import StrEnum


class WorkerTestRequestState(StrEnum):
    """Where a request to run one test stands: requested, allowed by the main agent, used by the run, or
    allowed again when the run stopped before it started."""

    REQUESTED = "requested"
    ALLOWED = "allowed"
    USED = "used"


OPEN_REQUEST_STATES = (WorkerTestRequestState.REQUESTED, WorkerTestRequestState.ALLOWED)
