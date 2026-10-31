from collections.abc import Sequence

from core.base.driver.hook_event_name import HookEventName
from core.base.query.queries import Queries
from core.modules.drivers.hook_call import HookCall
from core.modules.memories.mark_state import MarkState
from core.modules.memories.memory_mark import MemoryMark

DEFAULT_MARKS = (50, 80, 90)


class MarkTracker:
    """An agent's context marks: the one open now, and the next mark its context passed that it has not reached
    since its last compaction."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_marks(self, agent_id: int) -> list[MemoryMark]:
        return list(self.queries.query(MemoryMark).filter(agent_id=agent_id, state=MarkState.OPEN).all_rows())

    def next_reached(self, agent_id: int, percent: int, marks: Sequence[int]) -> int | None:
        passed = [mark for mark in marks if mark <= percent]
        if not passed:
            return None
        compactions = self.queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.COMPACT).descending("id").page(1, 1).rows
        compaction_text = next((call.created_at.text for call in compactions if call.created_at is not None), "")
        passed_percents = [mark.percent for mark in self.queries.query(MemoryMark).filter(agent_id=agent_id).all_rows() if mark.opened_at.text > compaction_text]
        highest = max(passed)
        return None if any(percent_reached >= highest for percent_reached in passed_percents) else highest
