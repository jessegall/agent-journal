from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.refusal import Refusal


class UserActorCheck:
    """The plugin changes only the person makes: an agent proposes a plugin instead."""

    @staticmethod
    def check(context: Context, action: str) -> None:
        UserActorCheck.check_actor(context.actor, action)

    @staticmethod
    def check_actor(actor: Actor, action: str) -> None:
        if actor.type is not ActorType.USER:
            raise Refusal(f"only the user {action} a plugin", "journal plugin propose <folder or git address> shows them a card")
