from core.base.driver.hook_event_name import HookEventName
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall


class ToolUseCount:
    """How many tools an agent has used after a timestamp."""

    @staticmethod
    def after_timestamp(queries: Queries, agent_id: int, timestamp: Timestamp) -> int:
        return queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE).matching(Greater("created_at", timestamp.text)).count()
