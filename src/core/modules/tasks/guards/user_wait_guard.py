from core.base.actor_type import ActorType
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.user_approval import UserApproval
from core.modules.tasks.support.task_opener import USER_TARGET
from core.modules.tasks.support.task_waits import TaskWaits
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class UserWaitGuard(Guard[Moved[Task]]):
    """Only a person opens a task that waits on the user."""

    name = "tasks.user-wait"
    moves = tuple([TaskLifecycle.unblock])

    def __init__(self, waits: TaskWaits) -> None:
        self.waits = waits

    def check(self, event: Moved[Task], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        if any(wait.target == USER_TARGET for wait in self.waits.pending_task(event.row.id)):
            raise UserApproval(f"Open task {event.row.id}, {event.row.title}, after completing the requested work?")
