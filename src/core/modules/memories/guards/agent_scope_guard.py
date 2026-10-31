from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.modules.memories.memory import Memory
from core.modules.memories.memory_scope import MemoryScope


class AgentScopeGuard(Guard):
    """An agent writes a memory only in its own environment, for the environment or for itself, both as it was
    and as it becomes."""

    name = "memories.agent-scope"
    event = "memory.*"

    def __init__(self, scope: MemoryScope) -> None:
        self.scope = scope

    def check(self, change: Change[Model]) -> None:
        if change.actor.type is not ActorType.AGENT:
            return
        for memory in (change.old_row, change.new_row):
            if isinstance(memory, Memory):
                self.scope.check(memory, change.actor)
