from collections.abc import Sequence

from core.base.driver.hook_event_name import HookEventName
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.minimum import Minimum
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.memories.models.enums.mark_state import MarkState
from core.modules.memories.models.memory_mark import MemoryMark

WHOLE = 100


class MarkTracker:
    """An agent's context marks: the one open now, and the next mark its context passed that it has not
    reached since its last compaction."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def open_marks(self, agent_id: int) -> list[MemoryMark]:
        return list(self.kept.read("memory_marks", lambda: tuple(self.queries.query(MemoryMark).filter(session_agent_id=agent_id, state=MarkState.OPEN).all_rows()),
                                   "session_agent_id = ? AND state = ?", [agent_id, MarkState.OPEN], name="memories.open_marks"))

    @staticmethod
    def spaced(marks: Sequence[int], maximum_tokens: int, gap_tokens: int) -> tuple[int, ...]:
        kept: list[int] = []
        for mark in sorted(marks, reverse=True):
            if not kept or (kept[-1] - mark) * maximum_tokens / WHOLE >= gap_tokens:
                kept.append(mark)
        return tuple(reversed(kept))

    def next_reached(self, agent_id: int, percent: int, marks: Sequence[int]) -> int | None:
        passed = [mark for mark in marks if mark <= percent]
        if not passed:
            return None
        compaction = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.COMPACT).descending("id").first()
        compaction_text = compaction.created_at.text if compaction is not None and compaction.created_at is not None else ""
        highest = max(passed)
        reached = self.queries.query(MemoryMark).filter(session_agent_id=agent_id).matching(Greater("opened_at", compaction_text)).matching(Minimum("percent", highest))
        return None if reached.exists() else highest
