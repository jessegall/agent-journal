from dataclasses import dataclass, replace
from engine.actor.actor import Actor
from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.state_holder import StateHolder
from engine.time.timestamp import Timestamp
from engine.errors.refusal import Refusal
from core.modules.tasks.models.enums.task_state import WORKING_STATES, UNFINISHED_STATES, TaskState
from core.modules.tasks.models.support.task_priority import NORMAL_PRIORITY, TaskPriority
from core.modules.tasks.models.support.task_complexity import TaskComplexity
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


TASK_TITLE_LIMIT_CHARACTERS = 80
def check_title(cli_name: str, title: str) -> None:
    if not 1 <= len(title) <= TASK_TITLE_LIMIT_CHARACTERS:
        raise Refusal(f"a {cli_name}'s title is 1 to {TASK_TITLE_LIMIT_CHARACTERS} characters, not {len(title)}", "say it shorter, and put the rest in --brief")
@dataclass(frozen=True, kw_only=True)
class Task(EnvironmentScoped, Model, StateHolder, Assignable):
    """One unit of work; its state moves only as TaskLifecycle allows. One actor holds its assignment, and the
    assignment of a plan or a phase passes over a task that is finished or that another actor works on."""

    model_name = "task"
    cli_name = "task"
    search_fields = ["title", "brief", "outcome"]
    lifecycle = TaskLifecycle
    added_state_moves = tuple([TaskLifecycle.cancel])
    takes_actors = ActorCount.SINGLE

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
    focused_at: Timestamp | None = None
    closed_at: Timestamp | None = None
    delegated_to: int | None = None
    independence_reason: str = ""

    def __post_init__(self) -> None:
        check_title(self.cli_name, self.title)

    def cascade_skips(self, actor_id: int) -> bool:
        if self.state not in UNFINISHED_STATES:
            return True
        return self.state in WORKING_STATES and self.holder_id not in (None, actor_id)

    def start(self, timestamp: Timestamp, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.start, holder_id=actor.id, started_at=timestamp)

    def focused(self, timestamp: Timestamp | None) -> "Task":
        return replace(self, focused_at=timestamp)

    def current_at(self) -> Timestamp:
        return max(stamp for stamp in (self.creation_timestamp(), self.started_at, self.focused_at) if stamp is not None)

    def close(self, timestamp: Timestamp, actor: Actor, outcome: str) -> "Task":
        return self.moved(TaskLifecycle.close, outcome=outcome, closed_at=timestamp, holder_id=None)

    def cancel(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.cancel, reason=reason, closed_at=timestamp, holder_id=None)

    def release(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.release, reason=reason, holder_id=None)

    def drop_hold(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Task":
        return self.moved(TaskLifecycle.drop_hold, reason=reason, holder_id=None)

    def reopen(self, timestamp: Timestamp, actor: Actor) -> "Task":
        return self.moved(TaskLifecycle.reopen, closed_at=None, outcome="", reason="")
