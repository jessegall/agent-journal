from dataclasses import dataclass
from enum import StrEnum

# the core's own actor is the first row of actors, made with the database, so it is known without a read
CORE_ACTOR_ID = 1


class ActorType(StrEnum):
    USER = "user"
    AGENT = "agent"
    MODULE = "module"
    CORE = "core"


@dataclass(frozen=True)
class Actor:
    """Who asks: a person, an agent, a module or the core, by the id of its row in actors."""

    id: int
    type: ActorType

    @classmethod
    def core(cls) -> "Actor":
        return cls(CORE_ACTOR_ID, ActorType.CORE)
