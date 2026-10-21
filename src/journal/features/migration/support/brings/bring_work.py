from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.task_log import TaskLog
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.task_logs import TaskLogs


class BringWork(EnvironmentKind):
    """A to-do's work log becomes its task's log lines, one for each entry, once the task has come across."""

    kind = "work"
    title = "task logs"

    def __init__(self, environments: Environments, ledger: MigratedRows, logs: TaskLogs) -> None:
        super().__init__(environments, ledger)
        self.logs = logs

    def left_behind(self, row: Version3Row, into: Environment) -> str:
        return super().left_behind(row, into) or ("" if self.task_of(row, into) else "its to-do did not come across")

    def task_of(self, row: Version3Row, into: Environment) -> int | None:
        found = self.ledger.referred(into.name, f"todo:{row.data.get('todo')}")
        return None if found is None else found.id

    def made(self, row: Version3Row, into: Environment, attached: Path, actor: Actor) -> TaskLog:
        task = self.task_of(row, into)
        lines = [body for _, body in row.sections if body] or [row.brief]
        return [self.logs.imported(TaskLog(environment_id=into.id, task_id=task, line=line), row.made_at(), actor) for line in lines][-1]
