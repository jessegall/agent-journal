from pathlib import Path
from typing import ClassVar

from journal.features.migration.support.import_tally import ImportTally
from journal.features.migration.support.version_3_row import Version3Row
from journal.features.migration.support.version_3_rows import Version3Rows
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.model import Model
from journal.support.ref import Ref
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows


class EnvironmentKind:
    """A version 3 kind kept per environment, brought across row by row for each environment that came: a row already brought is passed over, and one left behind is named with why."""

    kind: ClassVar[str]
    title: ClassVar[str]

    def __init__(self, environments: Environments, tally: MigratedRows) -> None:
        self.environments, self.ledger = environments, tally

    def import_rows(self, folder: Path, actor: Actor) -> ImportTally:
        rows = Version3Rows(folder)
        count, skipped = 0, []
        for environment in [e for e in rows.environments() if self.ledger.is_imported(f"project/environment/{e.n}")]:
            target = self.environments.existing(environment.title)
            for row in rows.rows(environment.title, self.kind):
                source = self.source(environment.title, row)
                reason = self.skipped(row, target)
                if reason:
                    skipped.append(f"{self.kind} {row.n} in {environment.title}: {reason}")
                    continue
                if self.ledger.is_imported(source):
                    continue
                try:
                    self.ledger.import_rows(source, lambda: self.created(row, target, folder / "environments" / environment.title / self.kind / str(row.n), actor), actor)
                except Exception as fault:
                    skipped.append(f"{self.kind} {row.n} in {environment.title}: could not be brought: {fault}")
                    continue
                count += 1
        return ImportTally(self.title, count, tuple(skipped))

    def source(self, environment: str, row: Version3Row) -> str:
        return f"environments/{environment}/{self.kind}/{row.n}"

    def skipped(self, row: Version3Row, target: Environment) -> str:
        return "deleted" if row.is_deleted() else ""

    def message(self, row: Version3Row, target: Environment) -> Ref | None:
        return next((rows for ref in row.refs if ref.startswith("message:") and (rows := self.ledger.referred(target.name, ref))), None)

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Model:
        raise NotImplementedError
