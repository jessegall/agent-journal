from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.refusal import Refusal


class PersonCheck:
    """The check the commands of the agent bar share: a person gives them, never an agent."""

    @staticmethod
    def require(context: Context, reason: str) -> None:
        if context.actor.type is not ActorType.USER:
            raise Refusal(reason, "ask the user to do it from the viewer")
