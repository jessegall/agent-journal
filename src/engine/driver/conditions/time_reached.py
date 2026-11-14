from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition


class TimeReached(BlockCondition):
    """This moment has come, given as a timestamp's text."""

    name = "time-reached"

    def is_true(self, check: BlockCheck) -> bool:
        return check.hook.timestamp.text >= self.text
