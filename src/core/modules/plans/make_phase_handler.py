from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plans.phase import Phase
from core.modules.plans.make_phase import MakePhase
from core.modules.plans.positions import Positions


class MakePhaseHandler(Handler[MakePhase, Phase]):
    """Saves a new phase at the place after the plan's last."""

    command = MakePhase

    def __init__(self, positions: Positions, repository: Repository) -> None:
        self.positions, self.repository = positions, repository

    def handle(self, command: MakePhase, context: Context) -> Phase:
        phase = Phase(plan_id=command.plan_id, creator_id=context.actor.id, position=self.positions.next_position(Phase, "plan_id", command.plan_id),
                      title=command.title, goal=command.goal, checkpoint=command.checkpoint)
        return self.repository.save(phase, context)
