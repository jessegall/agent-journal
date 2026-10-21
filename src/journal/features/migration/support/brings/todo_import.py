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

MIGRATED_PROGRESS_NOTE = "it was in progress in version 3 when the journal was brought across"


class TodoImport(EnvironmentKind):
    """A to-do becomes a task: done with its outcome, blocked with its reason, open, or parked when it was in progress, since one task alone is ever in hand; a struck one stays behind."""

    kind = "todo"
    title = "tasks"

    def __init__(self, environments: Environments, tally: MigratedRows, tasks: Tasks) -> None:
        super().__init__(environments, tally)
        self.tasks = tasks

    def skipped(self, row: Version3Row, target: Environment) -> str:
        return super().skipped(row, target) or ("struck" if row.data.get("struck") else "")

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Task:
        return self.tasks.imported(self.task(row, Task(environment_id=target.id, title=row.title, brief=row.brief)), row.creation_time(), actor)

    @staticmethod
    def task(row: Version3Row, task: Task) -> Task:
        if row.completed:
            return task.with_(state=TaskState.FINISHED, finished_at=row.close_time(), outcome=row.outcome)
        if row.data.get("blocked"):
            return task.with_(state=TaskState.BLOCKED, blocked_why=row.data["blocked"])
        if row.data.get("status") == "started":
            return task.with_(state=TaskState.SUSPENDED, parked_why=MIGRATED_PROGRESS_NOTE)
        return task
