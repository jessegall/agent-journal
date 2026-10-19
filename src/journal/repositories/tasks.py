from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.scoped_repository import ScopedRepository


class Tasks(ScopedRepository[Task]):
    model = Task

    def in_state(self, state: TaskState) -> list[Task]:
        return self.where(environment_id=self.scope.id, state=state)

    def unfinished_count(self) -> int:
        """How many tasks are not yet done or cancelled, counted by the database."""
        return self.connection.one("SELECT count(*) AS n FROM tasks WHERE environment_id = ? AND state NOT IN (?, ?)", (self.scope.id, TaskState.DONE.value, TaskState.CANCELLED.value))["n"]

    def unseen_by_user(self) -> int:
        """How many unfinished tasks the user did not make, so has not yet seen."""
        return self.counted_in("state NOT IN (?, ?) AND (created_by IS NULL OR created_by NOT LIKE 'user:%')", (TaskState.DONE.value, TaskState.CANCELLED.value))

    def shown(self) -> list[Task]:
        """What a list of tasks shows: every one not yet finished, however old, and the newest page of the finished ones, by number."""
        finished = (TaskState.DONE.value, TaskState.CANCELLED.value)
        unfinished = self.selected("environment_id = ? AND state NOT IN (?, ?) ORDER BY id", (self.scope.id, *finished))
        return sorted([*unfinished, *self.newest("environment_id = ? AND state IN (?, ?)", (self.scope.id, *finished))], key=lambda t: t.id)
