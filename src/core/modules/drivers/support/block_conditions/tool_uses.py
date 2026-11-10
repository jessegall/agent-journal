from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.drivers.models.support.tool_use_count import ToolUseCount


class ToolUses(BlockCondition):
    """The agent has used this many tools since the block opened."""

    name = "tool-uses"

    def is_true(self, check: BlockCheck) -> bool:
        return ToolUseCount.after_timestamp(check.container.get(Queries), check.hook.agent_id, check.opened_at) >= int(self.text)
