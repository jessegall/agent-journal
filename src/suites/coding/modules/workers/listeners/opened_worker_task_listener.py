from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.idle_worker_send import IdleWorkerSend


class OpenedWorkerTaskListener(SaveListener[Moved[Task]]):
    """A blocked task given to a worker goes to that worker once it opens."""

    name = "workers.opened-task"
    moves = tuple([TaskLifecycle.unblock])
    disabled_scopes = [ActorScope]

    def __init__(self, idle_send: IdleWorkerSend) -> None:
        self.idle_send = idle_send

    def handle(self, event: Moved[Task], context: Context) -> None:
        self.idle_send.send(event.row, context)
