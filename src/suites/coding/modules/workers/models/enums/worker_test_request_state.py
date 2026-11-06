from enum import StrEnum


class WorkerTestRequestState(StrEnum):
    """Where a request to run one test stands: asked, allowed by the main agent, or used by the run."""

    ASKED = "asked"
    ALLOWED = "allowed"
    USED = "used"
