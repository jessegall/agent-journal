from engine.change.updated import Updated
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.base.tasks.tasks_changed_together import TasksChangedTogether
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.send_worker.support.inactive_worker_send import InactiveWorkerSend


class AssignedWorkerTaskListener(SaveListener[Updated[Task]]):
    """An open task newly given to a worker goes to that worker at once when the worker is idle; the worker
    commands that hand tasks over send them themselves."""

    name = "workers.assigned-task"
    disabled_scopes = [ActorScope]

    def __init__(self, inactive_sender: InactiveWorkerSend) -> None:
        self.inactive_sender = inactive_sender

    def handle(self, event: Updated[Task], context: Context) -> None:
        task, old_task = event.row, event.old_row
        if isinstance(context.command, TasksChangedTogether):
            return
        if task.state is not TaskState.OPEN or old_task is None or old_task.delegated_to == task.delegated_to:
            return
        self.inactive_sender.send(task, context)
