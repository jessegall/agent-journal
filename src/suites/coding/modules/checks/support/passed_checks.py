from collections.abc import Sequence

from core.base.query.conditions.is_null import IsNull
from core.base.step_checks import StepChecks
from suites.coding.modules.checks.queries.check_query import CheckQuery


class PassedChecks(StepChecks):
    """A check has passed when it is not removed and its last run passed."""

    def __init__(self, checks: CheckQuery) -> None:
        self.checks = checks

    def unpassed(self, numbers: Sequence[int]) -> tuple[int, ...]:
        return tuple(number for number in numbers if not self.checks.matching(IsNull("removed_at")).filter(id=number, last_passed=True).exists())
