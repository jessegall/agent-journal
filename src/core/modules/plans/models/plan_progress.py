from dataclasses import dataclass
from engine.model.view_model import ViewModel
from core.modules.plans.models.support.views import PLAN_PROGRESS_SELECT


@dataclass(frozen=True, kw_only=True)
class PlanProgress(ViewModel):
    """How far a plan is: its tasks not cancelled, its tasks completed, the first phase with a task
    open and the average complexity of its scored tasks, none when no task is scored, read from the plan_progress view, the one place these counts are worked out."""

    cli_name = "plan"
    view = "plan_progress"
    key = "plan_id"
    select = PLAN_PROGRESS_SELECT

    plan_id: int
    task_count: int
    completed_count: int
    testing_count: int
    current_phase: int
    complexity: float | None = None
