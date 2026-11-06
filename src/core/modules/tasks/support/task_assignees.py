from core.base.agent_role import AgentRole
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task


class TaskAssignees:
    """Says which agents a task can be assigned to: the main agent, which hands tasks out, and no other. A suite
    whose helpers take tasks binds its own."""

    def check(self, agent: Agent) -> None:
        if agent.role != AgentRole.MAIN:
            raise Refusal(f"agent {agent.id} is a {agent.role} and takes no task", "only the main agent takes a task, to hand it out")

    def check_reassignment(self, task: Task) -> None:
        pass
