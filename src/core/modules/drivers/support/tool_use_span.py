from dataclasses import dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall


@dataclass(frozen=True)
class ToolUseSpan:
    """A span of tools the agent has used."""

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE).matching(Greater("created_at", start.text)).count() >= self.count
