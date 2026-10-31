from core.base.query.queries import Queries
from core.base.query.shared_rows import ModelRowIds, SharedRows
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.plan import Plan


class PlanSharedRows(SharedRows):
    """What a share of a plan includes: its phases and the tasks placed in them."""

    row = Plan

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def rows(self, row_id: int) -> list[ModelRowIds]:
        phase_ids = [phase.id for phase in self.queries.query(Phase).filter(plan_id=row_id).all_rows()]
        task_ids = [place.task_id for phase_id in phase_ids for place in self.queries.query(PhaseTask).filter(phase_id=phase_id).all_rows()]
        return [ModelRowIds("phase", phase_ids), ModelRowIds("task", task_ids)]
