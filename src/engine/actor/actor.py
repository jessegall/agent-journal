from dataclasses import dataclass, field

from engine.actor.errors.not_an_agent_refusal import NotAnAgentRefusal
from engine.enums.actor_type import ActorType


CORE_ACTOR_ID = 1
@dataclass(frozen=True)
class Actor:
    """Someone or something that makes a change: a user, an agent, a module or the core. An agent's actor
    also carries the agent's own id, which a row that names an agent stores; an agent actor built from its
    actor id alone, before every place builds it from the agent row, has the same number for both."""

    id: int
    type: ActorType
    session_agent_id: int | None = field(default=None, compare=False)

    def is_agent(self) -> bool:
        return self.type is ActorType.AGENT

    def agent_id(self) -> int:
        if not self.is_agent():
            raise NotAnAgentRefusal.of_type(self.type)
        return self.id if self.session_agent_id is None else self.session_agent_id

    # whether an actor is given and is an agent
    @staticmethod
    def given_agent(actor: "Actor | None") -> bool:
        return actor is not None and actor.is_agent()

    def is_person(self) -> bool:
        return self.type is ActorType.USER

    @classmethod
    def core(cls) -> "Actor":
        return cls(CORE_ACTOR_ID, ActorType.CORE)

    @classmethod
    def agent(cls, actor_id: int, agent_id: int) -> "Actor":
        return cls(actor_id, ActorType.AGENT, agent_id)
