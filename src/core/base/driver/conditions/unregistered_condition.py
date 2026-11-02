from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition


class UnregisteredCondition(BlockCondition):
    """A condition no installed module registers, which counts as true."""

    name = "lost"

    def is_true(self, check: BlockCheck) -> bool:
        return True
