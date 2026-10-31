from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.waits.wait_state import WaitState


class WaitLifecycle(Lifecycle):
    """A wait is open until it ends, and an ended wait can be resumed."""

    states = WaitState
    initial = [WaitState.OPEN]
    editable = [WaitState.OPEN]
    deletable = [WaitState.ENDED]

    end = Move("end", [WaitState.OPEN], WaitState.ENDED)
    resume = Move("resume", [WaitState.ENDED], WaitState.OPEN)
