from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.modules.phone.models.lifecycles.phone_lifecycle import PhoneLifecycle
from core.base.refusal import Refusal
from core.modules.phone.models.phone import Phone



class PhoneRowGuard(Guard[Changed[Phone]]):
    """Lets only the journal itself write a paired phone, when the viewer redeems a code, and the phone's own
    person unpair or delete it, so no agent can take over a phone's session."""

    name = "phone.phone-rows"

    def check(self, event: Changed[Phone], context: Context) -> None:
        actor = context.actor
        if actor.type is ActorType.CORE:
            return
        is_owner_change = isinstance(event, Deleted) or event.move is PhoneLifecycle.unpair
        if is_owner_change and actor.type is ActorType.USER and actor.id == event.row.person_id:
            return
        raise Refusal("only the phone's person unpairs it, and only the viewer pairs it", "unpair it from the Phones window")
