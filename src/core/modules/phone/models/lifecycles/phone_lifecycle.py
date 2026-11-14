from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from core.modules.phone.models.enums.phone_state import PhoneState


class PhoneLifecycle(Lifecycle):
    states = PhoneState
    initial = [PhoneState.PAIRED]
    editable = [PhoneState.PAIRED]
    deletable = [PhoneState.UNPAIRED]

    unpair = Move("unpair", [PhoneState.PAIRED], PhoneState.UNPAIRED)
