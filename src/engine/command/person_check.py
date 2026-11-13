from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.errors.refusal import Refusal


class PersonCheck:
    """The check the commands of the agent bar share: a user gives them, never an agent."""

    @staticmethod
    def require(context: Context, reason: str, *, returns_output: bool = False) -> None:
        PersonCheck.require_actor(context.actor, reason, returns_output=returns_output)

    @staticmethod
    def require_actor(actor: Actor, reason: str, *, returns_output: bool = False) -> None:
        if actor.type is ActorType.USER:
            return
        if actor.type is ActorType.AGENT:
            raise UserApprovalRefusal(reason, returns_output=returns_output)
        raise Refusal(reason)
