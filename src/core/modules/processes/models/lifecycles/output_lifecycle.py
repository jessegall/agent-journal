from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.processes.models.enums.output_state import OutputState


class OutputLifecycle(Lifecycle):
    states = OutputState
    initial = [OutputState.KEPT]
    editable = [OutputState.KEPT]
    deletable = tuple(OutputState)

    prune = Move("prune", [OutputState.KEPT], OutputState.PRUNED)
