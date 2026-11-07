from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.modules.tasks.models.support.task_priority import TaskPriority
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.support.views import TASK_CARDS_SELECT


@dataclass(frozen=True, kw_only=True)
class TaskCard(EnvironmentScoped, ViewModel):
    """A task's current state and assignment, as the task board shows it."""

    cli_name = "task"
    view = "task_cards"
    key = "id"
    select = TASK_CARDS_SELECT

    id: int
    environment_id: int
    title: str
    state: TaskState
    priority: TaskPriority
    reason: str
    automatic: bool
    closed_at: str | None
    delegated_to: int | None
    delegated_name: str | None
