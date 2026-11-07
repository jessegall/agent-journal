from dataclasses import dataclass
from core.base.actor_type import ActorType


CORE_ACTOR_ID = 1
@dataclass(frozen=True)
class Actor:
    """Someone or something that makes a change: a person, an agent, a module or the core."""

    id: int
    type: ActorType

    @classmethod
    def core(cls) -> "Actor":
        return cls(CORE_ACTOR_ID, ActorType.CORE)
