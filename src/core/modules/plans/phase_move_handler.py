from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plans.phase import Phase
from core.modules.plans.phase_move import PhaseMove


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
