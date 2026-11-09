from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from engine.errors.refusal import Refusal
from core.modules.plans.commands.place_phase.place_phase import PlacePhase
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.positions import Positions


class PlacePhaseHandler(Handler[PlacePhase, PhaseTask]):
    """Places a task in a phase: removes its place in another phase, if any, and adds one at the end of
    the new phase; the one handler for a command that changes more than one row."""

    command = PlacePhase

    def __init__(self, queries: Queries, repository: Repository, positions: Positions) -> None:
        self.queries, self.repository, self.positions = queries, repository, positions

    def handle(self, command: PlacePhase, context: Context) -> PhaseTask:
        phase = self.queries.query(Phase).find(command.phase_id)
        plan = self.queries.query(Plan).find(phase.plan_id)
        if plan.state in (PlanState.COMPLETED, PlanState.CANCELLED):
            raise Refusal(f"plan {plan.id} is {plan.state}, so no task can be placed in its phases")
        current = self.queries.query(PhaseTask).filter(task_id=command.task_id).first()
        if current is not None and current.phase_id == command.phase_id:
            return current
        if current is not None:
            self.repository.delete(current, context)
            self.positions.renumber(PhaseTask, "phase_id", current.phase_id, current.position, context)
        return self.repository.save(PhaseTask(phase_id=command.phase_id, task_id=command.task_id, creator_id=context.actor.id,
                                              position=self.positions.next_position(PhaseTask, "phase_id", command.phase_id)), context)
