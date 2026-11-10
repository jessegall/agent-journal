from engine.query.queries import Queries
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_outline_task import PlanOutlineTask
from core.modules.plans.support.plan_outline import PlanOutline
from core.modules.plans.support.outline_phase import OutlinePhase
from core.modules.plans.support.outline_task import OutlineTask

OUTLINE_REASON = "The outline of one plan names every task of that plan."


class PlanOutlines:
    """Reads a plan's phases and tasks in order."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def outline(self, plan_id: int) -> PlanOutline:
        places = tuple(sorted(self.queries.query(PlanOutlineTask).filter(plan_id=plan_id).full_table(OUTLINE_REASON).all_rows(), key=lambda place: (place.phase_position, -place.priority, place.task_id)))
        phases = tuple(self.queries.query(Phase).filter(plan_id=plan_id).ordered("position").all_rows())
        return PlanOutline(plan_id, tuple(OutlinePhase(phase.id, phase.title, phase.goal, tuple(OutlineTask(place.task_id, place.title, place.state.value, place.priority, place.complexity, place.tags, place.reason, place.automatic, place.delegated_to, place.main_delegate, place.helper_id, place.helper_name, place.helper_main) for place in places if place.phase_id == phase.id),
                                                       phase.checkpoint) for phase in phases))
