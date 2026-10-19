from journal.models.actor import Actor
from journal.models.migrated_row import MigratedRow
from journal.models.model import Model
from journal.models.ref import Ref
from journal.repositories.repository import Repository


class MigratedRows(Repository[MigratedRow]):
    model = MigratedRow

    def is_brought(self, source: str) -> bool:
        return self.connection.one("SELECT 1 AS found FROM migrated_rows WHERE source = ?", (source,)) is not None

    def record(self, source: str, row: Model, by: Actor) -> None:
        self.save(MigratedRow(source=source, target=str(Ref.to(row))), by)
