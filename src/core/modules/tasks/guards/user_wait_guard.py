from core.base.actor_type import ActorType
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_opener import USER_TARGET
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class UserWaitGuard(Guard[Moved[Task]]):
    """Only a person opens a task that waits on the user."""

    name = "tasks.user-wait"
    moves = (TaskLifecycle.unblock,)

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Moved[Task], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        if self.queries.query(TaskWait).filter(task_id=event.row.id, target=USER_TARGET).matching(IsNull("ended_at")).exists():
            raise Refusal(f"task {event.row.id} waits on the user", "the user opens it")
