from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.phone.models.phone import Phone

OWNER_EVENTS = ("phone.unpair", "phone.delete")


class PhoneRowGuard(Guard):
    """Lets only the journal itself write a paired phone, when the viewer redeems a code, and the phone's own
    person unpair or delete it, so no agent can take over a phone's session."""

    name = "phone.phone-rows"
    event = "phone.*"

    def check(self, change: Change[Model]) -> None:
        row = change.row
        actor = change.context.actor
        if not isinstance(row, Phone) or actor.type is ActorType.CORE:
            return
        if change.event in OWNER_EVENTS and actor.type is ActorType.USER and actor.id == row.person_id:
            return
        raise Refusal("only the phone's person unpairs it, and only the viewer pairs it", "unpair it from the Phones window")
