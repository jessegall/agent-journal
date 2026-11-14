from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from core.modules.memories.support.mark_tracker import MarkTracker


class MemoriesWeighed(BlockCondition):
    """The agent has no open memory mark."""

    name = "memories-weighed"

    def is_true(self, check: BlockCheck) -> bool:
        return not check.container.get(MarkTracker).open_marks(check.hook.agent_id)
