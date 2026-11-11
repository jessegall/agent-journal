from engine.command.context import Context
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.assignments.listeners.unassigned_listener import UnassignedListener
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.listeners.ask_task_closed_listener import CLOSED_STATES
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions


class AskTaskUnassignedListener(UnassignedListener):
    """A worker's open question about a task is closed as moot once the task is taken from the worker: nothing
    is left to answer. A task that is completed or cancelled closes its questions for that reason instead."""

    subject = Task
    name = "workers.ask-task-unassigned"
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, questions: WorkerQuestions) -> None:
        super().__init__(rows)
        self.questions = questions

    def unassigned(self, row: Task, actor_id: int, context: Context) -> None:
        if row.state not in CLOSED_STATES:
            self.questions.close_task_lines(row.id, f"task {row.id} is no longer the worker's", context)
