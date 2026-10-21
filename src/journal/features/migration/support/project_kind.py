from pathlib import Path
from typing import ClassVar

from journal.features.migration.support.import_tally import ImportTally
from journal.features.migration.support.version_3_row import Version3Row
from journal.features.migration.support.version_3_rows import Version3Rows
from journal.support.actor import Actor
from journal.models.model import Model
from journal.repositories.migrated_rows import MigratedRows


class ProjectKind:
    """A version 3 kind kept for the whole project, brought across row by row: a row already brought is passed over, and one left behind is named with why."""

    kind: ClassVar[str]
    title: ClassVar[str]

    def __init__(self, ledger: MigratedRows) -> None:
        self.ledger = ledger

    def bring(self, folder: Path, actor: Actor) -> ImportTally:
        count, skipped = 0, []
        for row in self.rows(Version3Rows(folder)):
            source = f"project/{self.kind}/{row.n}"
            why = self.left_behind(row)
            if why:
                skipped.append(f"{self.kind} {row.n}: {why}")
                continue
            if self.ledger.is_brought(source):
                continue
            try:
                self.ledger.bring(source, lambda: self.made(row, actor), actor)
            except Exception as fault:
                skipped.append(f"{self.kind} {row.n}: could not be brought: {fault}")
                continue
            count += 1
        return ImportTally(self.title, count, tuple(skipped))

    def rows(self, rows: Version3Rows) -> list[Version3Row]:
        return rows.project(self.kind)

    def left_behind(self, row: Version3Row) -> str:
        return "deleted" if row.is_deleted() else ""

    def made(self, row: Version3Row, actor: Actor) -> Model:
        raise NotImplementedError
