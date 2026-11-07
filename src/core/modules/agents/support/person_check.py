from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.user_approval import UserApproval
from core.base.refusal import Refusal


class PersonCheck:
    """The check the commands of the agent bar share: a person gives them, never an agent."""

    @staticmethod
    def require(context: Context, reason: str) -> None:
        PersonCheck.require_actor(context.actor, reason)

    @staticmethod
    def require_actor(actor: Actor, reason: str) -> None:
        if actor.type is ActorType.USER:
            return
        if actor.type is ActorType.AGENT:
            raise UserApproval(reason)
        raise Refusal(reason)
