from enum import StrEnum


class ProofState(StrEnum):
    """Where a proof of one point of a worker's brief stands: shown by the worker, or not done with why, then checked or sent back short."""

    SHOWN = "shown"
    UNFINISHED = "not done"
    CHECKED = "checked"
    SHORT = "short"
