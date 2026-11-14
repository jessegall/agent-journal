from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from core.modules.agents.support.agent_rows import AgentRows


class AgentResumed(BlockCondition):
    """A user resumed the paused agent, or the paused agent above it that started it."""

    name = "agent-resumed"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(AgentRows).pause_holder(check.hook.agent_id).paused_at is None
