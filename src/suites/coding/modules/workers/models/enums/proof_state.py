from enum import StrEnum


class ProofState(StrEnum):
    """Where a proof stands: shown by the worker, its test queued or running, checked, or sent back short."""

    SHOWN = "shown"
    QUEUED = "queued"
    RUNNING = "running"
    CHECKED = "checked"
    SHORT = "short"


TEST_WAITING_STATES = (ProofState.QUEUED, ProofState.RUNNING)
