from core.base.actor_type import ActorType
from core.base.guard.guard import Guard
from core.modules.memories.models.memory import Memory
from core.modules.memories.guards.support.memory_scope import MemoryScope
from core.base.change.changed import Changed
from core.base.command.context import Context


class AgentScopeGuard(Guard[Changed[Memory]]):
    """An agent writes a memory only in its own environment, both as it was and as it becomes."""

    name = "memories.agent-scope"
    is_safety = True

    def __init__(self, scope: MemoryScope) -> None:
        self.scope = scope

    def check(self, event: Changed[Memory], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        for memory in (event.old_row, event.row):
            if memory is not None:
                self.scope.check(memory, context.actor, event.old_row is None, context.command)
