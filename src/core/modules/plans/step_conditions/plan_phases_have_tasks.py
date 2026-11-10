from core.base.query.queries import Queries
from engine.check.step_condition import StepCondition
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask


class PlanPhasesHaveTasks(StepCondition):
    """Every phase of the plan has at least one task."""

    name = "plans.phases-have-tasks"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def problem(self, subject_id: int) -> str | None:
        filled = {task.phase_id for task in self.queries.query(PlanTask).filter(plan_id=subject_id).all_rows()}
        empty = next((phase.id for phase in self.queries.query(Phase).filter(plan_id=subject_id).oldest().all_rows() if phase.id not in filled), None)
        return None if empty is None else f"phase {empty} of plan {subject_id} has no tasks"
