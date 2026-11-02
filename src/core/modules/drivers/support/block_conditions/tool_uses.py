from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.driver.hook_event_name import HookEventName
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall


class ToolUses(BlockCondition):
    """The agent has used this many tools since the block opened."""

    name = "tool-uses"

    def is_true(self, check: BlockCheck) -> bool:
        calls = check.container.get(Queries).query(HookCall).filter(agent_id=check.hook.agent_id, hook=HookEventName.PRE_TOOL_USE).matching(Greater("created_at", check.opened_at.text))
        return calls.count() >= int(self.text)
