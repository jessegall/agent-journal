from typing import Callable

from journal.support.actor import Actor
from journal.models.migrated_row import MigratedRow
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.repositories.repository import Repository


class MigratedRows(Repository[MigratedRow]):
    model = MigratedRow

    def is_imported(self, source: str) -> bool:
        return self.connection.one("SELECT 1 AS found FROM migrated_rows WHERE source = ?", (source,)) is not None

    def imported_ref(self, source: str) -> Ref | None:
        rows = self.connection.one("SELECT target FROM migrated_rows WHERE source = ?", (source,))
        return None if rows is None else Ref.parse(rows["target"])

    def referred(self, environment: str, ref: str) -> Ref | None:
        kind, _, n = ref.partition(":")
        return self.imported_ref(f"environments/{environment}/{kind}/{n}") or self.imported_ref(f"project/{kind}/{n}")

    def import_rows(self, source: str, produced: Callable[[], Model], actor: Actor) -> None:
        with self.connection.transaction():
            self.record(source, produced(), actor)

    def record(self, source: str, row: Model, actor: Actor) -> None:
        self.save(MigratedRow(source=source, target=str(Ref.build(row))), actor)
