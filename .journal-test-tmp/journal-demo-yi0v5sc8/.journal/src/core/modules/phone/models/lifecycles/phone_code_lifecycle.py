from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.phone.models.enums.phone_code_state import PhoneCodeState


class PhoneCodeLifecycle(Lifecycle):
    states = PhoneCodeState
    initial = [PhoneCodeState.OPEN]
    editable = [PhoneCodeState.OPEN]
    deletable = (PhoneCodeState.OPEN, PhoneCodeState.SPENT)

    spend = Move("spend", [PhoneCodeState.OPEN], PhoneCodeState.SPENT)
