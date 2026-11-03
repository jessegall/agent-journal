from dataclasses import dataclass

from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class ClosedTasks:
    """A span of tasks closed in the agent's environment."""

    unit = "closed tasks"

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        environment_id = queries.query(Agent).find(agent_id).environment_id
        return queries.query(Task).filter(environment_id=environment_id).matching(Greater("closed_at", start.text)).count() >= self.count
