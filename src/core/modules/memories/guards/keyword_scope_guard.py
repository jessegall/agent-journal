from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.guards.support.memory_scope import MemoryScope


class KeywordScopeGuard(Guard):
    """An agent changes the keywords only of a memory it may write."""

    name = "memories.keyword-scope"
    event = "memory_keyword.*"

    def __init__(self, queries: Queries, scope: MemoryScope) -> None:
        self.queries, self.scope = queries, scope

    def check(self, change: Change[Model]) -> None:
        keyword = change.row
        if change.actor.type is ActorType.AGENT and isinstance(keyword, MemoryKeyword):
            self.scope.check(self.queries.query(Memory).find(keyword.memory_id), change.actor)
