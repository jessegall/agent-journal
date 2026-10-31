from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.plans.phase import Phase
from core.modules.plans.phase_task import PhaseTask


class Positions:
    """Keeps the places of a plan's phases and of a phase's tasks without gaps: a new one takes the place after the
    last, and when one leaves, every later one moves up by one, nearest first, so no two ever share a place."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def next_phase_position(self, plan_id: int) -> int:
        return max((phase.position for phase in self.queries.query(Phase).filter(plan_id=plan_id).all_rows()), default=0) + 1

    def next_place(self, phase_id: int) -> int:
        return max((place.position for place in self.queries.query(PhaseTask).filter(phase_id=phase_id).all_rows()), default=0) + 1

    def renumber_phases(self, plan_id: int, position: int, context: Context) -> None:
        later = [phase for phase in self.queries.query(Phase).filter(plan_id=plan_id).all_rows() if phase.position > position]
        for phase in sorted(later, key=lambda phase: phase.position):
            self.repository.save(phase.changed(position=phase.position - 1), context)

    def renumber_places(self, phase_id: int, position: int, context: Context) -> None:
        later = [place for place in self.queries.query(PhaseTask).filter(phase_id=phase_id).all_rows() if place.position > position]
        for place in sorted(later, key=lambda place: place.position):
            self.repository.save(place.changed(position=place.position - 1), context)
