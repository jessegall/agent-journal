from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.support.views import TASK_BLOCK_REVIEWS_SELECT


@dataclass(frozen=True, kw_only=True)
class TaskBlockReview(EnvironmentScoped, ViewModel):
    """A task's block, the last time this main agent reviewed it and the last time the task moved."""

    cli_name = "task-block-review"
    view = "task_block_reviews"
    key = "task_id"
    select = TASK_BLOCK_REVIEWS_SELECT

    task_id: int
    session_agent_id: int
    environment_id: int
    state: TaskState
    task_version: int
    block_version: int
    reviewed_at: Timestamp
    moved_at: Timestamp
    user_wait: bool
    automatic: bool
