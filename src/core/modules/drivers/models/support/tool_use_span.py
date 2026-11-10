from dataclasses import dataclass

from engine.driver.span import Span

from engine.driver.span_queries import SpanQueries
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.support.tool_use_count import ToolUseCount


@dataclass(frozen=True)
class ToolUseSpan(Span):
    """A span of tools the agent has used."""

    unit = "tool uses"

    count: int

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return ToolUseCount.after_timestamp(reads.queries, agent_id, start) >= self.count
