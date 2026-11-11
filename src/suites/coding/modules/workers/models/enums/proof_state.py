from enum import StrEnum


class ProofState(StrEnum):
    """Where a proof stands: shown by the worker, in a commit of a started plan with its test waiting for a
    checkpoint, its test queued or running, checked, or sent back short."""

    SHOWN = "shown"
    COMMITTED = "committed"
    QUEUED = "queued"
    RUNNING = "running"
    CHECKED = "checked"
    SHORT = "short"


MERGEABLE_STATES = tuple([ProofState.CHECKED])
COMMITTED_WORK_MERGEABLE_STATES = (ProofState.COMMITTED, ProofState.CHECKED)
TEST_WAITING_STATES = (ProofState.QUEUED, ProofState.RUNNING)
