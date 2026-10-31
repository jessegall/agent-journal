from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.memories.mark_state import MarkState


class MarkLifecycle(Lifecycle):
    states = MarkState
    initial = [MarkState.OPEN]
    editable = ()
    deletable = ()

    weigh = Move("weigh", [MarkState.OPEN], MarkState.WEIGHED)
    skip = Move("skip", [MarkState.OPEN], MarkState.SKIPPED)
