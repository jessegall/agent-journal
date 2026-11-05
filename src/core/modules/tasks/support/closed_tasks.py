from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.span import Span

from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery


@dataclass(frozen=True)
class ClosedTasks(Span):
    """A span of tasks closed in the agent's environment."""

    unit = "closed tasks"

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        environment_id = queries.query(Agent).find(agent_id).environment_id
        return queries.query(Task).matching(Greater("closed_at", start.text)).count() >= self.count

    def has_passed_many(self, queries: Queries, agent_id: int, starts: Sequence[Timestamp], checked_at: Timestamp) -> list[bool]:
        environment_id = queries.query(Agent).find(agent_id).environment_id
        return [count >= self.count for count in TaskQuery(queries.database, queries.tables).closed_counts(starts)]
