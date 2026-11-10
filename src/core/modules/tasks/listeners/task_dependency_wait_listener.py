from engine.change.created import Created
from engine.change.deleted import Deleted
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.support.dependency_waits import DependencyWaits


class TaskDependencyWaitListener(SaveListener[Created[TaskDependency] | Deleted[TaskDependency]]):
    """A dependency made blocks its task while the other task is open; a dependency removed can open it."""

    name = "tasks.dependency-waits"
    disabled_scopes = [ActorScope]

    def __init__(self, waits: DependencyWaits) -> None:
        self.waits = waits

    def handle(self, event: Created[TaskDependency] | Deleted[TaskDependency], context: Context) -> None:
        self.waits.update_wait(event.row.task_id, event.row.dependency_id, context)
