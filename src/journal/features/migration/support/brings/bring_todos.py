from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.tasks import Tasks

IN_PROGRESS = "it was in progress in version 3 when the journal was brought across"


class BringTodos(EnvironmentKind):
    """A to-do becomes a task: done with its outcome, blocked with its reason, open, or parked when it was in progress, since one task alone is ever in hand; a struck one stays behind."""

    kind = "todo"
    title = "tasks"

    def __init__(self, environments: Environments, ledger: MigratedRows, tasks: Tasks) -> None:
        super().__init__(environments, ledger)
        self.tasks = tasks

    def left_behind(self, row: Version3Row, into: Environment) -> str:
        return super().left_behind(row, into) or ("struck" if row.data.get("struck") else "")

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Task:
        return self.tasks.imported(self.task(row, Task(environment_id=into.id, title=row.title, brief=row.brief)), row.made_at(), by)

    @staticmethod
    def task(row: Version3Row, task: Task) -> Task:
        """The task in the state the to-do stood in."""
        if row.completed:
            return task.with_(state=TaskState.DONE, finished_at=row.closed_at(), outcome=row.outcome)
        if row.data.get("blocked"):
            return task.with_(state=TaskState.BLOCKED, blocked_why=row.data["blocked"])
        if row.data.get("status") == "started":
            return task.with_(state=TaskState.PARKED, parked_why=IN_PROGRESS)
        return task
