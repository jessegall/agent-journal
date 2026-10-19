from pathlib import Path
from typing import ClassVar

from journal.features.migration.brought import Brought
from journal.features.migration.version_3_row import Version3Row
from journal.features.migration.version_3_rows import Version3Rows
from journal.models.actor import Actor
from journal.models.environment import Environment
from journal.models.model import Model
from journal.models.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows


class EnvironmentKind:
    """A version 3 kind kept per environment, brought across row by row for each environment that came: a row already brought is passed over, and one left behind is named with why."""

    kind: ClassVar[str]
    """The kind's name in version 3, as its folder is named."""
    title: ClassVar[str]
    """What the report calls the rows."""

    def __init__(self, environments: Environments, ledger: MigratedRows) -> None:
        self.environments, self.ledger = environments, ledger

    def bring(self, folder: Path, by: Actor) -> Brought:
        rows = Version3Rows(folder)
        count, skipped = 0, []
        for environment in [e for e in rows.environments() if self.ledger.is_brought(f"project/environment/{e.n}")]:
            into = self.environments.existing(environment.title)
            for row in rows.of(environment.title, self.kind):
                source = f"environments/{environment.title}/{self.kind}/{row.n}"
                why = self.left_behind(row, into)
                if why:
                    skipped.append(f"{self.kind} {row.n} in {environment.title}: {why}")
                    continue
                if self.ledger.is_brought(source):
                    continue
                self.ledger.record(source, self.made(row, into, folder / "environments" / environment.title / self.kind / str(row.n), by), by)
                count += 1
        return Brought(self.title, count, tuple(skipped))

    def left_behind(self, row: Version3Row, into: Environment) -> str:
        """Why the row stays in the backup; empty when it comes across."""
        return "deleted" if row.is_deleted() else ""

    def message_of(self, row: Version3Row, into: Environment) -> Ref | None:
        """The message the row refers to, as it came across; none when it refers to none that came."""
        return next((found for ref in row.refs if ref.startswith("message:") and (found := self.ledger.referred(into.name, ref))), None)

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Model:
        """The row it becomes here; attached is the folder of its files, when it has one."""
        raise NotImplementedError
