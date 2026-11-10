from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.modules.plans.models.phase import Phase
from core.modules.plans.commands.move_phase.move_phase import MovePhase
from core.modules.plans.support.positions import Positions


class MovePhaseHandler(Handler[MovePhase, Phase]):
    """Moves a phase while keeping the plan's positions without gaps."""

    command = MovePhase

    def __init__(self, rows: EventRows, positions: Positions) -> None:
        self.rows, self.positions = rows, positions

    def handle(self, command: MovePhase, context: Context) -> Phase:
        phase = self.rows.required(Phase, command.phase_id)
        return self.positions.move(phase, "plan_id", phase.plan_id, command.position, context)
