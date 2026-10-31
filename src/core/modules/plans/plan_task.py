from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.plans.views import PLAN_TASKS_SELECT
from core.modules.tasks.task_state import TaskState


@dataclass(frozen=True, kw_only=True)
class PlanTask(ViewModel):
    """A task placed in a plan, with the places that order it, read from the plan_tasks view."""

    cli_name = "plan-task"
    view = "plan_tasks"
    key = "task_id"
    select = PLAN_TASKS_SELECT

    task_id: int
    plan_id: int
    phase_id: int
    phase_position: int
    checkpoint: bool
    position: int
    state: TaskState
    closed_at: Timestamp | None = None
