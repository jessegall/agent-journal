from journal.models.task import Task, TaskLog, TaskState
from journal.repositories.base import ScopedRepository


class Tasks(ScopedRepository[Task]):
    model = Task

    def in_state(self, environment_id: int, state: TaskState) -> list[Task]: ...


class TaskLogs(ScopedRepository[TaskLog]):
    model = TaskLog

    def of(self, task: Task) -> list[TaskLog]: ...
