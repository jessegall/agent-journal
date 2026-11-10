from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.check.step_checks import StepChecks
from suites.coding.modules.checks.queries.check_query import CheckQuery


class PassedChecks(StepChecks):
    """A check has passed when it is not removed and its last run passed."""

    def __init__(self, checks: CheckQuery) -> None:
        self.checks = checks

    def unpassed(self, numbers: Sequence[int]) -> tuple[int, ...]:
        passed = {check.id for check in self.checks.matching(IsNull("removed_at")).filter(last_passed=True).matching(Among("id", tuple(numbers))).all_rows()}
        return tuple(number for number in numbers if number not in passed)
