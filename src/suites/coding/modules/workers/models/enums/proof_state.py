from enum import StrEnum


class ProofState(StrEnum):
    """Where a proof stands: shown by the worker, checked, or sent back short."""

    SHOWN = "shown"
    CHECKED = "checked"
    SHORT = "short"
