from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from core.modules.agents.support.agent_label import AgentLabel


class TaskAssignees:
    """Says which agents a task can be assigned to: the main agent, which hands tasks out, and no other. A suite
    whose helpers take tasks binds its own."""

    def check_running(self, agent: Agent) -> None:
        if agent.ended_at is not None:
            raise Refusal(f"{AgentLabel.labelled(agent).text} has ended", "journal agent list shows who is running")
        self.check(agent)

    def check(self, agent: Agent) -> None:
        if agent.role != AgentRole.MAIN:
            raise Refusal(f"{AgentLabel.labelled(agent).text} is a {agent.role} and takes no task", "only the main agent takes a task, to hand it out")

    def check_reassignment(self, task: Task) -> None:
        pass
