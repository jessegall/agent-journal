from engine.query.queries import Queries
from engine.check.step_condition import StepCondition
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask


class PlanPhasesHaveTasks(StepCondition):
    """Every phase of the plan has at least one task."""

    name = "plans.phases-have-tasks"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def problem(self, subject_id: int) -> str | None:
        places = self.queries.query(PhaseTask).where_column("phase_id", "phases.id")
        empty_phase = self.queries.query(Phase).filter(plan_id=subject_id).where_not_exists(places).oldest().first()
        empty = None if empty_phase is None else empty_phase.id
        return None if empty is None else f"phase {empty} of plan {subject_id} has no tasks"
