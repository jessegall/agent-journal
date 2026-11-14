from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions

CLOSED_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)


class AskTaskClosedListener(SaveListener[Changed[Task]]):
    """A worker's open question about a task is closed as moot once the task is completed or cancelled: nothing
    is left to answer."""

    name = "workers.ask-task-closed"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions) -> None:
        self.questions = questions

    def handle(self, event: Changed[Task], context: Context) -> None:
        old, new = event.old_row, event.row
        if old is None:
            return
        if new.state in CLOSED_STATES and old.state is not new.state:
            self.questions.close_task_lines(new.id, f"task {new.id} is {new.state.value}", context)
