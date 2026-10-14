from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.scoped_repository import ScopedRepository


class Tasks(ScopedRepository[Task]):
    model = Task

    def in_state(self, environment_id: int, state: TaskState) -> list[Task]:
        return self.where(environment_id=environment_id, state=state)
