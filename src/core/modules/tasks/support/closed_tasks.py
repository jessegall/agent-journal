from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.span import Span

from core.base.query.conditions.greater import Greater
from core.base.driver.span_queries import SpanQueries
from engine.time.timestamp import Timestamp
from core.modules.tasks.queries.task_query import TaskQuery


@dataclass(frozen=True)
class ClosedTasks(Span):
    """A span of tasks closed in the agent's environment."""

    unit = "closed tasks"
    count: int

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return TaskQuery(reads.queries.database, reads.queries.tables, reads.kept).matching(Greater("closed_at", start.text)).count() >= self.count

    def has_passed_many(self, reads: SpanQueries, agent_id: int, starts: Sequence[Timestamp], checked_at: Timestamp) -> list[bool]:
        return [count >= self.count for count in TaskQuery(reads.queries.database, reads.queries.tables, reads.kept).closed_counts(starts)]
