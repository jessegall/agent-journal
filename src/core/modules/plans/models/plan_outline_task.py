from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.plans.models.support.views import PLAN_OUTLINE_TASKS_SELECT
from core.modules.tasks.models.enums.task_state import TaskState


@dataclass(frozen=True, kw_only=True)
class PlanOutlineTask(ViewModel):
    """A task placed in a plan with its title and the helper it is queued for or held by, read from the plan
    outline view."""

    cli_name = "plan-outline-task"
    view = "plan_outline_tasks"
    key = "task_id"
    select = PLAN_OUTLINE_TASKS_SELECT

    task_id: int
    plan_id: int
    phase_id: int
    phase_position: int
    priority: int
    state: TaskState
    title: str
    helper_id: int | None
    helper_name: str | None
