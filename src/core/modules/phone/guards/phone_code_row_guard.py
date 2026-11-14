from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.phone.models.phone_code import PhoneCode



class PhoneCodeRowGuard(Guard[Changed[PhoneCode]]):
    """Lets a user make only their own phone code, and only the journal itself redeem one."""

    name = "phone.phone-code-rows"

    def check(self, event: Changed[PhoneCode], context: Context) -> None:
        actor = context.actor
        if actor.type is ActorType.CORE:
            return
        if isinstance(event, Created) and actor.type is ActorType.USER and actor.id == event.row.person_id:
            return
        raise Refusal("a phone code belongs to its user and can only be redeemed by the viewer")
