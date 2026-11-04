from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_opener import USER_TARGET


class UserWaitGuard(Guard):
    """Only a person opens a task that waits on the user."""

    name = "tasks.user-wait"
    event = "task.unblock"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        if change.actor.type is not ActorType.AGENT:
            return
        if self.queries.query(TaskWait).filter(task_id=change.row.id, target=USER_TARGET).matching(IsNull("ended_at")).exists():
            raise Refusal(f"task {change.row.id} waits on the user", "the user opens it")
