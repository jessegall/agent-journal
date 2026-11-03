from core.base.driver.hook_event_name import HookEventName
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall


class ToolUseCount:
    """How many tools an agent has used since a moment."""

    @staticmethod
    def since(queries: Queries, agent_id: int, moment: Timestamp) -> int:
        return queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE).matching(Greater("created_at", moment.text)).count()
