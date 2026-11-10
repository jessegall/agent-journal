from dataclasses import dataclass

from engine.driver.span import Span

from engine.query.conditions.greater import Greater
from engine.driver.span_queries import SpanQueries
from engine.time.timestamp import Timestamp
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery


@dataclass(frozen=True)
class WriteSpan(Span):
    """A span of writes to files the agent was let make."""

    unit = "writes"

    count: int

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return HookCallQuery(reads.queries.database, reads.queries.tables, reads.kept).agent(agent_id).filter(writes_files=True, answer=HookAnswer.ALLOWED).matching(Greater("created_at", start.text)).count() >= self.count
