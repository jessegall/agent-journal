from engine.change.moved import Moved
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.send_worker.support.inactive_worker_send import InactiveWorkerSend


class OpenedWorkerTaskListener(SaveListener[Moved[Task]]):
    """A blocked task given to a worker goes to that worker once it opens."""

    name = "workers.opened-task"
    moves = tuple([TaskLifecycle.unblock])
    disabled_scopes = [ActorScope]

    def __init__(self, inactive_sender: InactiveWorkerSend) -> None:
        self.inactive_sender = inactive_sender

    def handle(self, event: Moved[Task], context: Context) -> None:
        self.inactive_sender.send(event.row, context)
