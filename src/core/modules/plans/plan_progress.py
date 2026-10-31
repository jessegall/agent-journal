from dataclasses import dataclass
from core.base.model.view_model import ViewModel
from core.modules.plans.views import PLAN_PROGRESS_SELECT


@dataclass(frozen=True, kw_only=True)
class PlanProgress(ViewModel):
    """How far a plan is: its tasks not cancelled, its tasks completed, and the first phase with a task open, read
    from the plan_progress view, the one place these counts are worked out."""

    cli_name = "plan"
    view = "plan_progress"
    key = "plan_id"
    select = PLAN_PROGRESS_SELECT

    plan_id: int
    task_count: int
    completed_count: int
    current_phase: int
