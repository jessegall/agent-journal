from dataclasses import dataclass

from engine.database.database import Database
from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from engine.setting.setting_values import SettingValues
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.current_context_window import CurrentContextWindow
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from core.modules.memories.support.marks.mark_tracker import MarkTracker
from core.modules.memories.support.memory_settings import MARK_SPACING_TOKENS_SETTING, MARK_TOOL_USES_SETTING, MARKS_SETTING
from core.modules.settings.bindings.support.context_share import ContextShare

WEIGHED_REASON = "at a mark the agent weighs every memory it holds"


@dataclass(frozen=True)
class MarkReached:
    """A memory mark the agent's context passed: its percent, the tool uses before the agent is blocked, and the
    memories it weighs, heaviest first."""

    percent: int
    tool_uses: int
    memory_ids: tuple[int, ...]


class ReachedMark:
    """When the agent's context, counted against the context limit when one is on, passes a mark of memories.marks
    it has not reached since its last compaction and no mark is open, the mark it reached; two marks too few tokens
    apart count as the higher. Read once a hook, so the line that names the mark and the effect that opens it agree."""

    def __init__(self, marks: MarkTracker, settings: SettingValues, memories: ActiveMemoryQuery, share: ContextShare, agents: AgentRows,
                 current_window: CurrentContextWindow, request_values: RequestValues, database: Database) -> None:
        self.marks, self.settings, self.memories, self.share, self.agents, self.current_window = marks, settings, memories, share, agents, current_window
        self.request_values, self.database = request_values, database

    def reached(self, event: HookEvent, agent_id: int) -> MarkReached | None:
        return self.request_values.read(f"memories.reached-mark:{agent_id}:{event.firing}", self.database.change_mark, lambda: self.found(agent_id))

    def found(self, agent_id: int) -> MarkReached | None:
        agent = self.agents.find(agent_id)
        usage = self.share.window_reading(agent, self.current_window.window(agent))
        if usage.percent is None:
            return None
        marks = self.settings.numbers(MARKS_SETTING)
        reached = self.marks.next_reached(agent_id, usage.percent, self.spaced_marks(usage.maximum_tokens(), marks))
        if reached is None or self.marks.open_marks(agent_id):
            return None
        tool_uses = self.settings.numbers(MARK_TOOL_USES_SETTING)
        memories = self.memories.all_weighted(WEIGHED_REASON)
        return MarkReached(reached, dict(zip(marks, tool_uses)).get(reached, tool_uses[-1]), tuple(memory.memory_id for memory in memories))

    def spaced_marks(self, maximum_tokens: int | None, marks: tuple[int, ...]) -> tuple[int, ...]:
        return marks if maximum_tokens is None else self.marks.spaced(marks, maximum_tokens, self.settings.number(MARK_SPACING_TOKENS_SETTING))
