from dataclasses import dataclass
from enum import StrEnum

# the core's own actor is the first row of actors, made with the database, so it is known without a read
CORE_ACTOR_ID = 1


class ActorType(StrEnum):
    """The types of actor: a person, an agent, a module or the core."""

    USER = "user"
    AGENT = "agent"
    MODULE = "module"
    CORE = "core"


@dataclass(frozen=True)
class Actor:
    """Someone or something that makes a change: a person, an agent, a module or the core."""

    id: int
    type: ActorType

    @classmethod
    def core(cls) -> "Actor":
        return cls(CORE_ACTOR_ID, ActorType.CORE)
