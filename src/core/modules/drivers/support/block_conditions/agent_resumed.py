from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent


class AgentResumed(BlockCondition):
    """A person resumed the paused agent."""

    name = "agent-resumed"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Agent).find(check.hook.agent_id).paused_at is None
