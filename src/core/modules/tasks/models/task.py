from dataclasses import dataclass
from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.base.refusal import Refusal
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.enums.task_priority import TaskPriority
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


TITLE_LIMIT_CHARACTERS = 80
def check_title(cli_name: str, title: str) -> None:
    if not 1 <= len(title) <= TITLE_LIMIT_CHARACTERS:
        raise Refusal(f"a {cli_name}'s title is 1 to {TITLE_LIMIT_CHARACTERS} characters, not {len(title)}", "say it shorter, and put the rest in --brief")
@dataclass(frozen=True, kw_only=True)
class Task(Model):
    """One unit of work; its state moves only as TaskLifecycle allows."""

    model_name = "task"
    cli_name = "task"
    lifecycle = TaskLifecycle

    environment_id: int
    holder_id: int | None = None
    creator_id: int
    title: str
    brief: str = ""
    state: TaskState = TaskState.OPEN
    priority: TaskPriority = TaskPriority.NORMAL
    reason: str = ""
    outcome: str = ""
    closed_at: Timestamp | None = None

    def __post_init__(self) -> None:
        check_title(self.cli_name, self.title)

    def start(self, timestamp: Timestamp, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.start, holder_id=actor.id)

    def close(self, timestamp: Timestamp, actor: Actor, outcome: str) -> "Task":
        return self.moved(TaskLifecycle.close, outcome=outcome, closed_at=timestamp, holder_id=None)

    def cancel(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.cancel, reason=reason, closed_at=timestamp, holder_id=None)

    def release(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.release, reason=reason, holder_id=None)

    def reopen(self, timestamp: Timestamp, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.reopen, closed_at=None, outcome="", reason="")
