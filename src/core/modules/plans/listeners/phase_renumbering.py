from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.plans.phase import Phase
from core.modules.plans.positions import Positions


class PhaseRenumbering(SaveListener):
    """A deleted phase leaves no gap: the phases after it move up by one, in the same transaction."""

    name = "plans.renumber-phases"
    event = "phase.delete"

    def __init__(self, positions: Positions) -> None:
        self.positions = positions

    def handle(self, change: Change[Model]) -> None:
        phase = change.row
        if isinstance(phase, Phase):
            self.positions.renumber_phases(phase.plan_id, phase.position, change.context)
