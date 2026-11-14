from engine.query.queries import Queries
from engine.query.rows.model_row_ids import ModelRowIds
from engine.query.rows.shared_rows import SharedRows
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.plans.models.plan import Plan

SHARED_ROWS_REASON = "a plan is shared with every phase and task it holds"


class PlanSharedRows(SharedRows):
    """What a share of a plan includes: its phases and the tasks placed in them."""

    row = Plan

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def rows(self, row_id: int) -> list[ModelRowIds]:
        phase_ids = [phase.id for phase in self.queries.query(Phase).filter(plan_id=row_id).every_row(SHARED_ROWS_REASON)]
        task_ids = [place.task_id for phase_id in phase_ids for place in self.queries.query(PhaseTask).filter(phase_id=phase_id).every_row(SHARED_ROWS_REASON)]
        return [ModelRowIds("phase", phase_ids), ModelRowIds("task", task_ids)]
