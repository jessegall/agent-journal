from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.repositories.scoped_repository import ScopedRepository


class TaskLogs(ScopedRepository[TaskLog]):
    model = TaskLog

    def logs(self, task: Task) -> list[TaskLog]:
        return self.global_matching(task_id=task.id)
