from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plans.phase import Phase
from core.modules.plans.phase_commands import PhaseMake, PhaseMove, PhasePlace
from core.modules.plans.phase_task import PhaseTask
from core.modules.plans.positions import Positions


class PhaseMakeHandler(Handler[PhaseMake, Phase]):
    """Saves a new phase at the place after the plan's last."""

    command = PhaseMake

    def __init__(self, positions: Positions, repository: Repository) -> None:
        self.positions, self.repository = positions, repository

    def handle(self, command: PhaseMake, context: Context) -> Phase:
        phase = Phase(plan_id=command.plan_id, creator_id=context.actor.id, position=self.positions.next_position(Phase, "plan_id", command.plan_id),
                      title=command.title, goal=command.goal, checkpoint=command.checkpoint)
        return self.repository.save(phase, context)


class PhaseMoveHandler(Handler[PhaseMove, Phase]):
    """Moves a phase to another place: it steps aside past the last place, the phases between shift by one, and it
    takes its new place, so no two phases of a plan ever share a place."""

    command = PhaseMove

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: PhaseMove, context: Context) -> Phase:
        phase = self.queries.query(Phase).find(command.phase_id)
        phases = list(self.queries.query(Phase).filter(plan_id=phase.plan_id).oldest().all_rows())
        if not 1 <= command.position <= len(phases):
            raise Refusal(f"plan {phase.plan_id} has places 1 to {len(phases)}, not {command.position}")
        old_position, new_position = phase.position, command.position
        phase = self.repository.save(phase.changed(position=len(phases) + 1), context)
        step = 1 if new_position < old_position else -1
        moved_phases = [row for row in phases if row.id != phase.id and min(old_position, new_position) <= row.position <= max(old_position, new_position)]
        for row in sorted(moved_phases, key=lambda row: row.position, reverse=step == 1):
            self.repository.save(row.changed(position=row.position + step), context)
        return self.repository.save(phase.changed(position=new_position), context)


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
