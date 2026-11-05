from enum import StrEnum


class OutputState(StrEnum):
    """Whether what a process printed is still in its folder."""

    KEPT = "kept"
    PRUNED = "pruned"
