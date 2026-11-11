from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from engine.errors.refusal import Refusal
from suites.coding.models.enums.ask_topic import AskTopic

WORKER_TASKS_HINT = "journal worker status lists your tasks"


class WorkerTaskAccess:
    """Says whether a worker has a task started, and refuses work on a task it has not: the task is another
    worker's, is blocked, or is not started."""

    @staticmethod
    def is_holder(task: Task, worker_id: int) -> bool:
        return task.state is TaskState.STARTED and task.holder_id == worker_id

    @staticmethod
    def refusal(task: Task, worker_id: int) -> Refusal:
        if worker_id not in (task.delegated_to, task.holder_id):
            return Refusal(f"task {task.id} is not yours", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        if task.state is TaskState.BLOCKED:
            return Refusal(f"task {task.id} is blocked: {task.reason}", AskTopic.GENERAL.hint(WORKER_TASKS_HINT))
        return Refusal(f"task {task.id} is not started", AskTopic.GENERAL.hint(f"journal task start {task.id}"))
