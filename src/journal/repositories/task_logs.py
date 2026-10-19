from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.repositories.scoped_repository import ScopedRepository


class TaskLogs(ScopedRepository[TaskLog]):
    model = TaskLog

    def of(self, task: Task) -> list[TaskLog]:
        return self.across_environments(task_id=task.id)
