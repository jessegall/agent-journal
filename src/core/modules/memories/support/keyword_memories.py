from engine.database.database import Database
from engine.driver.hook_event import HookEvent
from engine.driver.hook_keywords import hook_keywords
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from engine.setting.setting_values import SettingValues
from core.modules.memories.models.keyword_memory import KeywordMemory
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from core.modules.memories.support.memory_settings import KEYWORD_LIMIT

KEYWORDS_REASON = "every memory whose keyword the hook names may be delivered"


class KeywordMemories:
    """The active memories whose keyword a prompt or a tool use names and that the agent has not been given
    since its last compaction, heaviest first and at most memories.keyword-limit of them: read once a hook, so
    the lines that give them and the effect that records them agree."""

    def __init__(self, queries: Queries, settings: SettingValues, memories: ActiveMemoryQuery, request_values: RequestValues, database: Database) -> None:
        self.queries, self.settings, self.memories, self.request_values, self.database = queries, settings, memories, request_values, database

    def memory_ids(self, event: HookEvent, agent_id: int) -> tuple[int, ...]:
        return self.request_values.read(f"memories.keyword:{agent_id}:{event.event_id}", self.database.change_mark, lambda: self.found(event, agent_id))

    def found(self, event: HookEvent, agent_id: int) -> tuple[int, ...]:
        hook_terms = hook_keywords(event)
        if not hook_terms:
            return ()
        memory_ids = [keyword.memory_id for keyword in self.queries.query(KeywordMemory).matching(Among("word", hook_terms)).every_row(KEYWORDS_REASON)]
        limit = self.settings.number(KEYWORD_LIMIT)
        return tuple(memory.memory_id for memory in self.memories.among(memory_ids).absent_memories(agent_id).weight_order().take(limit))
