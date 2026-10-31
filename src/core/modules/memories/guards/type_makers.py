from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.memories.memory import Memory
from core.modules.memories.memory_type import MemoryType


class TypeMakers(Guard):
    """An agent makes, or changes a memory to, only a type agents may make; a rule is the user's alone."""

    name = "memories.type-makers"
    event = "memory.*"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        memory = change.row
        if change.actor.type is not ActorType.AGENT or not isinstance(memory, Memory) or change.event.endswith(".delete"):
            return
        if change.old_row is not None and "type" not in change.fields:
            return
        types = self.queries.query(MemoryType).filter(name=memory.type).page(1, 1).rows
        if types and not types[0].agents_may_make:
            raise Refusal(f"only the user makes a {memory.type}", "keep it as a fact with journal memory make '<text>' --type fact, or ask the user")
