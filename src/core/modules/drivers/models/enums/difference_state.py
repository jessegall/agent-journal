from enum import StrEnum


class DifferenceState(StrEnum):
    """How the old answer and the new one compare: agreed, as the program sees them, or a difference and how it
    stands."""

    AGREED = "agreed"
    UNEXPLAINED = "unexplained"
    INTENDED = "intended"
    FIXED = "fixed"
