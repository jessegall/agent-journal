from collections.abc import Sequence


class StepChecks:
    """Says which of the checks a sequence step lists have not passed. Without a suite that keeps checks none
    can pass; a suite that has them binds its own."""

    def unpassed(self, numbers: Sequence[int]) -> tuple[int, ...]:
        return tuple(numbers)
