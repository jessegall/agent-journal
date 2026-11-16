from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal


class NotAnAgentRefusal(Refusal):
    """An actor that is no agent was asked for the agent it acts as."""

    @classmethod
    def of_type(cls, actor_type: ActorType) -> "NotAnAgentRefusal":
        return cls(f"a {actor_type.value} actor acts as no agent", "ask an agent's actor for its agent id")
