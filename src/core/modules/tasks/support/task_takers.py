from core.base.agent_role import AgentRole
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent


class TaskTakers:
    """Says which agents a task can be assigned to: the main agent, which hands tasks out, and no other. A suite
    whose helpers take tasks binds its own."""

    def check(self, agent: Agent) -> None:
        if agent.role is not AgentRole.MAIN:
            raise Refusal(f"agent {agent.id} is a {agent.role.value} and takes no task", "only the main agent takes a task, to hand it out")
