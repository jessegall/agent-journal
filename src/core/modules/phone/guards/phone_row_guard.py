from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.guard.guard import Guard
from core.modules.phone.models.lifecycles.phone_lifecycle import PhoneLifecycle
from engine.errors.refusal import Refusal
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
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
        if is_owner_change and actor.type is ActorType.AGENT:
            raise UserApprovalRefusal(f"Unpair phone {event.row.id}?", required_person_id=event.row.person_id, command=context.command)
        raise Refusal("a paired phone belongs to its person and can only be paired by the viewer")
