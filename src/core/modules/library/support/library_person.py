from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.refusal import Refusal


class LibraryPerson:
    """The check every command that decides for the team shares: a person gives it, never an agent."""

    @staticmethod
    def require(context: Context) -> None:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person connects to the shared server or disconnects from it", "ask the user to do it on the Teams page")
