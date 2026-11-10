from core.base.listener.save_listener import SaveListener
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.positions import Positions
from engine.change.deleted import Deleted
from engine.command.context import Context


class PhaseRenumberingListener(SaveListener[Deleted[Phase]]):
    """A deleted phase leaves no gap: the phases after it move up by one, in the same transaction."""

    name = "plans.renumber-phases"

    def __init__(self, positions: Positions) -> None:
        self.positions = positions

    def handle(self, event: Deleted[Phase], context: Context) -> None:
        phase = event.row
        self.positions.renumber(Phase, "plan_id", phase.plan_id, phase.position, context)
