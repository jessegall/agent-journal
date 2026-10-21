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

    def __init__(self, environments: Environments, tally: MigratedRows, reminders: Reminders) -> None:
        super().__init__(environments, tally)
        self.reminders = reminders

    def skipped(self, row: Version3Row, target: Environment) -> str:
        return super().skipped(row, target) or ("retired" if row.completed else "")

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Reminder:
        return self.reminders.imported(Reminder(environment_id=target.id, text=row.brief or row.title, keywords=tuple(row.listed("keywords"))), row.created_at(), actor)
