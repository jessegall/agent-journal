from dataclasses import dataclass

from engine.actor.errors.not_an_agent_refusal import NotAnAgentRefusal
from engine.enums.actor_type import ActorType


CORE_ACTOR_ID = 0
FIRST_OTHER_ACTOR_ID = 1000000
MAIN_AGENT_ID = 1
@dataclass(frozen=True)
class Actor:
    """Someone or something that makes a change: a user, an agent, a module or the core. An agent's actor id
    is its agent id."""

    id: int
    type: ActorType

    def is_agent(self) -> bool:
        return self.type is ActorType.AGENT

    def agent_id(self) -> int:
        if not self.is_agent():
            raise NotAnAgentRefusal.of_type(self.type)
        return self.id

    # whether an actor is given and is an agent
    @staticmethod
    def given_agent(actor: "Actor | None") -> bool:
        return actor is not None and actor.is_agent()

    def is_person(self) -> bool:
        return self.type is ActorType.USER

    @classmethod
    def core(cls) -> "Actor":
        return cls(CORE_ACTOR_ID, ActorType.CORE)
