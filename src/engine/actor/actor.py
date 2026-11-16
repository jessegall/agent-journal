from dataclasses import dataclass
from engine.enums.actor_type import ActorType


CORE_ACTOR_ID = 1
@dataclass(frozen=True)
class Actor:
    """Someone or something that makes a change: a user, an agent, a module or the core."""

    id: int
    type: ActorType

    def is_agent(self) -> bool:
        return self.type is ActorType.AGENT

    # whether an actor is given and is an agent
    @staticmethod
    def given_agent(actor: "Actor | None") -> bool:
        return actor is not None and actor.is_agent()

    def is_person(self) -> bool:
        return self.type is ActorType.USER

    @classmethod
    def core(cls) -> "Actor":
        return cls(CORE_ACTOR_ID, ActorType.CORE)
