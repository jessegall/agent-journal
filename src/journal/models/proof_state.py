from enum import StrEnum


class ProofState(StrEnum):
    """Where a proof of one point of a worker's brief stands: shown by the worker, or not done with why, then checked or sent back short, or stale once the point's wording changed."""

    SHOWN = "shown"
    UNFINISHED = "not done"
    CHECKED = "checked"
    CHECKED_UNFINISHED = "checked, not done"
    SHORT = "short"
    STALE = "stale"
