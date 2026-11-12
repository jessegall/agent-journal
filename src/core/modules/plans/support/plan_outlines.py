from engine.query.queries import Queries
from core.modules.plans.models.plan_outline_task import PlanOutlineTask
from core.modules.plans.support.checkpoint_runs import CheckpointRuns
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.plan_outline import PlanOutline
from core.modules.plans.support.outline_phase import OutlinePhase
from core.modules.plans.support.outline_task import OutlineTask

OUTLINE_REASON = "The outline of one plan names every task of that plan."


class PlanOutlines:
    """Reads a plan's phases and tasks in order, with how each checkpoint stands and the lines the runs of
    its checkpoints add."""

    def __init__(self, queries: Queries, checkpoints: PlanCheckpoints, runs: CheckpointRuns) -> None:
        self.queries, self.checkpoints, self.runs = queries, checkpoints, runs

    def outline(self, plan_id: int) -> PlanOutline:
        places = tuple(sorted(self.queries.query(PlanOutlineTask).filter(plan_id=plan_id).every_row(OUTLINE_REASON), key=lambda place: (place.phase_position, -place.priority, place.task_id)))
        windows = self.checkpoints.windows(plan_id)
        phases = windows.phases
        return PlanOutline(plan_id, tuple(OutlinePhase(phase.id, phase.title, phase.goal, tuple(OutlineTask(place.task_id, place.title, place.state.value, place.priority, place.complexity, place.tags, place.reason, place.automatic, place.delegated_to, place.main_delegate, place.helper_id, place.helper_name, place.helper_main) for place in places if place.phase_id == phase.id),
                                                       phase.checkpoint) for phase in phases), (*self.checkpoints.status_lines(plan_id, windows), *self.runs.notes(phases)))
