from collections.abc import Sequence

from core.base.driver.hook_event_name import HookEventName
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.minimum import Minimum
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.memories.models.enums.mark_state import MarkState
from core.modules.memories.models.memory_mark import MemoryMark



class MarkTracker:
    """An agent's context marks: the one open now, and the next mark its context passed that it has not
    reached since its last compaction."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_marks(self, agent_id: int) -> list[MemoryMark]:
        return list(self.queries.query(MemoryMark).filter(session_agent_id=agent_id, state=MarkState.OPEN).all_rows())

    def next_reached(self, agent_id: int, percent: int, marks: Sequence[int]) -> int | None:
        passed = [mark for mark in marks if mark <= percent]
        if not passed:
            return None
        compactions = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.COMPACT).descending("id").limited(1)
        compaction_text = next((call.created_at.text for call in compactions if call.created_at is not None), "")
        highest = max(passed)
        reached = self.queries.query(MemoryMark).filter(session_agent_id=agent_id).matching(Greater("opened_at", compaction_text)).matching(Minimum("percent", highest))
        return None if reached.exists() else highest
