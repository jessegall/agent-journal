from dataclasses import dataclass
from core.base.actor import Actor
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model
from core.base.model.state_holder import StateHolder
from core.base.timestamp import Timestamp
from core.base.refusal import Refusal
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.support.task_priority import NORMAL_PRIORITY, TaskPriority
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


TASK_TITLE_LIMIT_CHARACTERS = 80
def check_title(cli_name: str, title: str) -> None:
    if not 1 <= len(title) <= TASK_TITLE_LIMIT_CHARACTERS:
        raise Refusal(f"a {cli_name}'s title is 1 to {TASK_TITLE_LIMIT_CHARACTERS} characters, not {len(title)}", "say it shorter, and put the rest in --brief")
@dataclass(frozen=True, kw_only=True)
class Task(EnvironmentScoped, Model, StateHolder):
    """One unit of work; its state moves only as TaskLifecycle allows."""

    model_name = "task"
    cli_name = "task"
    search_fields = ["title", "brief", "outcome"]
    lifecycle = TaskLifecycle
    added_state_moves = tuple([TaskLifecycle.cancel])

    environment_id: int = 0
    holder_id: int | None = None
    creator_id: int
    title: str
    brief: str = ""
    state: TaskState = TaskState.OPEN
    priority: TaskPriority = NORMAL_PRIORITY
    complexity: TaskComplexity | None = None
    reason: str = ""
    outcome: str = ""
    started_at: Timestamp | None = None
    closed_at: Timestamp | None = None
    delegated_to: int | None = None

    def __post_init__(self) -> None:
        check_title(self.cli_name, self.title)

    def start(self, timestamp: Timestamp, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.start, holder_id=actor.id, started_at=timestamp)

    def close(self, timestamp: Timestamp, actor: Actor, outcome: str) -> "Task":
        return self.moved(TaskLifecycle.close, outcome=outcome, closed_at=timestamp, holder_id=None)

    def cancel(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.cancel, reason=reason, closed_at=timestamp, holder_id=None)

    def release(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.release, reason=reason, holder_id=None)

    def reopen(self, timestamp: Timestamp, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.reopen, closed_at=None, outcome="", reason="")
