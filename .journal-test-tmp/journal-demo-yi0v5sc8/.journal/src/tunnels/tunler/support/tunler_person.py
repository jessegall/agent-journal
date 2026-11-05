from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.refusal import Refusal


class TunlerPerson:
    """The check every command that changes tunler shares: a person gives it, never an agent."""

    @staticmethod
    def require(context: Context) -> None:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person logs in to tunler or changes it", "ask the user to do it from the viewer")
