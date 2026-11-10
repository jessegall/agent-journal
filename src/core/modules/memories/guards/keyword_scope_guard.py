from engine.enums.actor_type import ActorType
from engine.guard.guard import Guard
from engine.query.queries import Queries
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_keyword import MemoryKeyword
from core.modules.memories.guards.support.memory_scope import MemoryScope
from core.base.change.changed import Changed
from engine.command.context import Context


class KeywordScopeGuard(Guard[Changed[MemoryKeyword]]):
    """An agent changes the keywords only of a memory it may write."""

    name = "memories.keyword-scope"

    def __init__(self, queries: Queries, scope: MemoryScope) -> None:
        self.queries, self.scope = queries, scope

    def check(self, event: Changed[MemoryKeyword], context: Context) -> None:
        keyword = event.row
        if context.actor.type is ActorType.AGENT:
            self.scope.check(self.queries.query(Memory).find(keyword.memory_id), context.actor, False, context.command)
