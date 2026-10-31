from enum import StrEnum


class PointFinding(StrEnum):
    """What a reviewer found of one point of the brief."""

    PASSED = "passed"
    SHORT = "short"
    UNDECIDED = "undecided"
