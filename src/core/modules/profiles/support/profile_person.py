from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.refusal import Refusal


def check_profile_person(context: Context) -> None:
    if context.actor.type is not ActorType.USER:
        raise Refusal("only a person changes a profile", "say in your report what you would change")
