from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.task_log import TaskLog
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.task_logs import TaskLogs


class WorkImport(EnvironmentKind):
    """A to-do's work log becomes its task's log lines, one for each entry, once the task has come across."""

    kind = "work"
    title = "task logs"

    def __init__(self, environments: Environments, tally: MigratedRows, logs: TaskLogs) -> None:
        super().__init__(environments, tally)
        self.logs = logs

    def skipped(self, row: Version3Row, target: Environment) -> str:
        return super().skipped(row, target) or ("" if self.task(row, target) else "its to-do did not come across")

    def task(self, row: Version3Row, target: Environment) -> int | None:
        rows = self.ledger.referred(target.name, f"todo:{row.data.get('todo')}")
        return None if rows is None else rows.id

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> TaskLog:
        task = self.task(row, target)
        lines = [body for _, body in row.sections if body] or [row.brief]
        return [self.logs.imported(TaskLog(environment_id=target.id, task_id=task, line=line), row.creation_time(), actor) for line in lines][-1]
