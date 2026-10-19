from pathlib import Path
from typing import ClassVar

from journal.features.migration.support.brought import Brought
from journal.features.migration.support.version_3_row import Version3Row
from journal.features.migration.support.version_3_rows import Version3Rows
from journal.support.actor import Actor
from journal.models.model import Model
from journal.repositories.migrated_rows import MigratedRows


class ProjectKind:
    """A version 3 kind kept for the whole project, brought across row by row: a row already brought is passed over, and one left behind is named with why."""

    kind: ClassVar[str]
    """The kind's name in version 3, as its folder is named."""
    title: ClassVar[str]
    """What the report calls the rows."""

    def __init__(self, ledger: MigratedRows) -> None:
        self.ledger = ledger

    def bring(self, folder: Path, by: Actor) -> Brought:
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
                self.ledger.bring(source, lambda: self.made(row, by), by)
            except Exception as fault:
                skipped.append(f"{self.kind} {row.n}: could not be brought: {fault}")
                continue
            count += 1
        return Brought(self.title, count, tuple(skipped))

    def rows(self, rows: Version3Rows) -> list[Version3Row]:
        return rows.project(self.kind)

    def left_behind(self, row: Version3Row) -> str:
        """Why the row stays in the backup; empty when it comes across."""
        return "deleted" if row.is_deleted() else ""

    def made(self, row: Version3Row, by: Actor) -> Model:
        raise NotImplementedError
