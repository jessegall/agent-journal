from engine.command.context import Context
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.support.tasks_changed_together import TasksChangedTogether
from core.modules.assignments.listeners.assigned_listener import AssignedListener
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.send_worker.support.inactive_worker_send import InactiveWorkerSend


class AssignedWorkerTaskListener(AssignedListener):
    """An open task newly given to a worker goes to that worker at once when the worker is idle; the worker
    commands that hand tasks over send them themselves."""

    subject = Task
    name = "workers.assigned-task"
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, inactive_sender: InactiveWorkerSend) -> None:
        super().__init__(rows)
        self.inactive_sender = inactive_sender

    def assigned(self, row: Task, actor_id: int, context: Context) -> None:
        if isinstance(context.command, TasksChangedTogether) or row.state is not TaskState.OPEN:
            return
        self.inactive_sender.send(row, context)
