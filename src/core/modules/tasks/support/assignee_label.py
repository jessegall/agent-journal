from engine.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_card import UNASSIGNED_LABEL


class AssigneeLabel:
    """Names the actor a task is assigned to as a line names it: an agent by its role and number, a user by name."""

    def __init__(self, queries: Queries, assignments: Assignments) -> None:
        self.queries, self.assignments = queries, assignments

    def task_label(self, task: Task) -> str:
        actor_id = self.assignments.actor(task)
        return UNASSIGNED_LABEL if actor_id is None else self.text(actor_id)

    def text(self, actor_id: int) -> str:
        agent = self.assignments.agent_row(actor_id)
        if agent is not None:
            return AgentLabel.from_agent(agent).text
        return self.queries.query(ActorRecord).find(actor_id).name
