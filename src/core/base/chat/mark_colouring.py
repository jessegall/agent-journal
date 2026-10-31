from enum import StrEnum


class MarkColouring(StrEnum):
    """Whether a mark's colour comes from its outcome or from its group alone."""

    GROUP = "group"
    OUTCOME = "outcome"
