from core.base.driver.hook_event_name import HookEventName
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall


class ContextResets:
    """When an agent's context window was last emptied: its newest compaction, or the newest clear."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def last_reset(self, agent_id: int) -> str:
        return max(self.last_compaction(agent_id), self.last_clear(agent_id))

    def last_compaction(self, agent_id: int) -> str:
        call = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.COMPACT).descending("id").first()
        return call.created_at.text if call is not None and call.created_at is not None else ""

    def last_clear(self, agent_id: int) -> str:
        starts = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.SESSION_START).descending("id").all_rows()
        call = next((start for start in starts if start.is_clear_start), None)
        return call.created_at.text if call is not None and call.created_at is not None else ""
