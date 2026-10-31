from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.phone.models.phone_code import PhoneCode

PHONE_CODE_CREATED = "phone_code.create"


class PhoneCodeRowGuard(Guard):
    """Lets a person make only their own phone code, and only the journal itself redeem one."""

    name = "phone.phone-code-rows"
    event = "phone_code.*"

    def check(self, change: Change[Model]) -> None:
        row = change.row
        actor = change.context.actor
        if not isinstance(row, PhoneCode) or actor.type is ActorType.CORE:
            return
        if change.event == PHONE_CODE_CREATED and actor.type is ActorType.USER and actor.id == row.person_id:
            return
        raise Refusal("only a person makes their own phone code, and only the viewer redeems it", "ask for a code with journal phone pair")
