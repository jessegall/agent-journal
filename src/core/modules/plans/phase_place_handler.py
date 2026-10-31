from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.phase_place import PhasePlace
from core.modules.plans.phase_task import PhaseTask
from core.modules.plans.positions import Positions


class PhasePlaceHandler(Handler[PhasePlace, PhaseTask]):
    """Places a task in a phase: removes its place in another phase, if any, and adds one at the end of the new
    phase; the one handler for a command that changes more than one row."""

    command = PhasePlace

    def __init__(self, queries: Queries, repository: Repository, positions: Positions) -> None:
        self.queries, self.repository, self.positions = queries, repository, positions

    def handle(self, command: PhasePlace, context: Context) -> PhaseTask:
        current = self.queries.query(PhaseTask).filter(task_id=command.task_id).page(1, 1).rows
        if current and current[0].phase_id == command.phase_id:
            return current[0]
        if current:
            self.repository.delete(current[0], context)
            self.positions.renumber(PhaseTask, "phase_id", current[0].phase_id, current[0].position, context)
        return self.repository.save(PhaseTask(phase_id=command.phase_id, task_id=command.task_id, creator_id=context.actor.id,
                                              position=self.positions.next_position(PhaseTask, "phase_id", command.phase_id)), context)
