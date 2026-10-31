from enum import StrEnum


class StepOutcome(StrEnum):
    """How a step of a review ended: none for a step that is no verdict."""

    NONE = "none"
    PASSED = "passed"
    FAILED = "failed"
