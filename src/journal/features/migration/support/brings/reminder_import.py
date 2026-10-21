from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.reminder import Reminder
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.reminders import Reminders


class ReminderImport(EnvironmentKind):
    """A reminder keeps its text and keywords; a retired one stays behind."""

    kind = "reminder"
    title = "reminders"

    def __init__(self, environments: Environments, ledger: MigratedRows, reminders: Reminders) -> None:
        super().__init__(environments, ledger)
        self.reminders = reminders

    def skipped(self, row: Version3Row, into: Environment) -> str:
        return super().skipped(row, into) or ("retired" if row.completed else "")

    def created(self, row: Version3Row, into: Environment, attached: Path, actor: Actor) -> Reminder:
        return self.reminders.imported(Reminder(environment_id=into.id, text=row.brief or row.title, keywords=tuple(row.listed("keywords"))), row.creation_time(), actor)
