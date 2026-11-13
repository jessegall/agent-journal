from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from engine.errors.refusal import Refusal
from core.modules.tasks.support.assignee_label import AssigneeLabel
from suites.coding.models.enums.ask_topic import AskTopic

WORKER_TASKS_HINT = "journal worker status lists your tasks"


class WorkerTaskAccess:
    """Says whether a worker has a task started, and refuses work on a task it has not: another agent has it
    started, it is another worker's, it is blocked, or it is not started."""

    def __init__(self, assignments: Assignments, labels: AssigneeLabel) -> None:
        self.assignments, self.labels = assignments, labels

    @staticmethod
    def is_holder(task: Task, worker_id: int) -> bool:
        return task.state is TaskState.STARTED and task.holder_id == worker_id

    @staticmethod
    def is_held_by_another(task: Task, worker_id: int) -> bool:
        return task.state is TaskState.STARTED and task.holder_id not in (None, worker_id)

    def refusal(self, task: Task, worker_id: int) -> Refusal:
        if WorkerTaskAccess.is_held_by_another(task, worker_id):
            return Refusal(f"task {task.id} is held by {self.labels.text(task.holder_id)}", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        if worker_id not in (self.assignments.actor(task), task.holder_id):
            return Refusal(f"task {task.id} is not yours", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        if task.state is TaskState.BLOCKED:
            return Refusal(f"task {task.id} is blocked: {task.reason}", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        return Refusal(f"task {task.id} is not started", AskTopic.GENERAL.hint(f"journal task start {task.id}"))
