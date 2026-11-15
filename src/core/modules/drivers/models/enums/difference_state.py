from enum import StrEnum


class DifferenceState(StrEnum):
    """How a difference between the old answer and the new one stands."""

    UNEXPLAINED = "unexplained"
    INTENDED = "intended"
    FIXED = "fixed"
