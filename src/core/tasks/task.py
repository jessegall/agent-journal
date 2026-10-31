from dataclasses import dataclass
from enum import StrEnum

from core.base.actor import Actor
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.moment import Moment
from core.base.refusal import Refusal

TITLE_LIMIT_CHARACTERS = 80


def check_title(cli_noun: str, title: str) -> None:
    if not 1 <= len(title) <= TITLE_LIMIT_CHARACTERS:
        raise Refusal(f"a {cli_noun}'s title is 1 to {TITLE_LIMIT_CHARACTERS} characters, not {len(title)}", "say it shorter, and put the rest in --brief")


class TaskState(StrEnum):
    """Where a task stands."""

    OPEN = "open"
    STARTED = "started"
    PAUSED = "paused"
    BLOCKED = "blocked"
    TESTING = "testing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TaskPriority(StrEnum):
    """How soon a task should be taken up."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"


class TaskLifecycle(Lifecycle):
    states = TaskState
    initial = (TaskState.OPEN,)
    editable = (TaskState.OPEN, TaskState.STARTED, TaskState.PAUSED, TaskState.BLOCKED, TaskState.TESTING)
    deletable = (TaskState.OPEN, TaskState.CANCELLED)

    start = Move("start", (TaskState.OPEN,), TaskState.STARTED)
    pause = Move("pause", (TaskState.STARTED,), TaskState.PAUSED)
    resume = Move("resume", (TaskState.PAUSED,), TaskState.STARTED)
    block = Move("block", (TaskState.OPEN, TaskState.STARTED, TaskState.PAUSED), TaskState.BLOCKED)
    unblock = Move("unblock", (TaskState.BLOCKED,), TaskState.OPEN)
    test = Move("test", (TaskState.STARTED,), TaskState.TESTING)
    close = Move("close", (TaskState.STARTED, TaskState.TESTING), TaskState.COMPLETED)
    cancel = Move("cancel", (TaskState.OPEN, TaskState.STARTED, TaskState.PAUSED, TaskState.BLOCKED, TaskState.TESTING), TaskState.CANCELLED)
    reopen = Move("reopen", (TaskState.COMPLETED, TaskState.CANCELLED), TaskState.OPEN)


@dataclass(frozen=True, kw_only=True)
class Task(Model):
    """One unit of work; its state moves only as TaskLifecycle allows."""

    model_name = "task"
    cli_noun = "task"
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
    closed_at: Moment | None = None

    def __post_init__(self) -> None:
        check_title(self.cli_noun, self.title)

    def start(self, moment: Moment, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.start, holder_id=actor.id)

    def pause(self, moment: Moment, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.pause, reason=reason)

    def close(self, moment: Moment, actor: Actor, outcome: str) -> "Task":
        return self.moved(TaskLifecycle.close, outcome=outcome, closed_at=moment, holder_id=None)

    def cancel(self, moment: Moment, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.cancel, reason=reason, closed_at=moment, holder_id=None)

    def reopen(self, moment: Moment, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.reopen, closed_at=None, outcome="", reason="")
