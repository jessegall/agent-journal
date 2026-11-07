from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from suites.coding.modules.checks.models.check import Check


class CheckPassed(BlockCondition):
    """This check last passed."""

    name = "check-passed"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Check).find(int(self.text)).last_passed is True
