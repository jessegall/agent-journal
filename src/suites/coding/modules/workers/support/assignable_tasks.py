from engine.errors.refusal import Refusal
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task

ASSIGNABLE_STATES = (TaskState.OPEN, TaskState.BLOCKED)


class AssignableTasks:
    """The tasks a worker may be given: open ones, and blocked ones that stay assigned to it and reach it once they
    open. The worker starts on the first open task."""

    @staticmethod
    def checked(tasks: list[Task], sender_id: int | None = None) -> list[Task]:
        for task in tasks:
            if task.state not in ASSIGNABLE_STATES and not (task.state is TaskState.STARTED and task.holder_id == sender_id):
                raise Refusal(f"task {task.id} is {task.state.value}", "only an open or a blocked task can be assigned to a worker")
        return AssignableTasks.open_first(tasks)

    @staticmethod
    def open_first(tasks: list[Task]) -> list[Task]:
        first = next((task for task in tasks if task.state is TaskState.OPEN), None)
        if first is None:
            return tasks
        return [first, *(task for task in tasks if task is not first)]

    @staticmethod
    def has_open(tasks: list[Task]) -> bool:
        return any(task.state is TaskState.OPEN for task in tasks)

    @staticmethod
    def all_blocked(tasks: list[Task]) -> bool:
        return all(task.state is TaskState.BLOCKED for task in tasks)
