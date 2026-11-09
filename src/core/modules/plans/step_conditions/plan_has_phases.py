from core.base.query.queries import Queries
from core.base.step_condition import StepCondition
from core.modules.plans.models.phase import Phase


class PlanHasPhases(StepCondition):
    """The plan has at least one phase."""

    name = "plans.has-phases"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def problem(self, subject_id: int) -> str | None:
        return None if self.queries.query(Phase).filter(plan_id=subject_id).exists() else f"plan {subject_id} has no phases"
