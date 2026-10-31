from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal


class TypesByUser(Guard):
    """A memory type is made, changed and deleted only by the user, a module or the core."""

    name = "memories.types-by-user"
    event = "memory_type.*"

    def check(self, change: Change[Model]) -> None:
        if change.actor.type is ActorType.AGENT:
            raise Refusal("only the user changes memory types and their switches", "ask the user")
