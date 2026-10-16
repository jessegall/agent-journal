from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.scoped_repository import ScopedRepository


class Tasks(ScopedRepository[Task]):
    model = Task

    def in_state(self, state: TaskState) -> list[Task]:
        return self.where(environment_id=self.scope.id, state=state)
