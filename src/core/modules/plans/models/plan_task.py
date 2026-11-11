from dataclasses import dataclass

from engine.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.plans.models.support.views import PLAN_TASKS_SELECT
from core.modules.tasks.models.enums.task_state import TaskState


@dataclass(frozen=True, kw_only=True)
class PlanTask(ViewModel):
    """A task placed in a plan, with the places that order it and whether the tests of its checkpoint phase
    passed, read from the plan_tasks view. A task of a checkpoint phase keeps the phases after it closed
    while it is open or the tests of its phase have not passed."""

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
    priority: int
    closed_at: Timestamp | None = None
    checkpoint_passed: bool = False

    @property
    def is_untested_checkpoint(self) -> bool:
        return self.checkpoint and (self.closed_at is None or not self.checkpoint_passed)
