from dataclasses import dataclass

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.support.tool_use_count import ToolUseCount


@dataclass(frozen=True)
class ToolUseSpan:
    """A span of tools the agent has used."""

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return ToolUseCount.since(queries, agent_id, start) >= self.count
