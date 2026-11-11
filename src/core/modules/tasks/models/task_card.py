from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.enums.actor_type import ActorType
from engine.model.view_model import ViewModel
from core.modules.tasks.models.support.task_priority import TaskPriority
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.support.views import TASK_CARDS_SELECT

NOBODY = "nobody"


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
    complexity: TaskComplexity | None
    tags: tuple[str, ...]
    reason: str
    automatic: bool
    closed_at: str | None
    assigned_to: int | None
    assigned_name: str | None
    assigned_type: ActorType | None
    assigned_is_main: bool

    def assignee_label(self) -> str:
        if self.assigned_to is None or self.assigned_name is None:
            return NOBODY
        return f"agent {self.assigned_to}" if self.assigned_type is ActorType.AGENT else self.assigned_name
