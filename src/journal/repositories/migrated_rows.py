from journal.models.actor import Actor
from journal.models.migrated_row import MigratedRow
from journal.models.model import Model
from journal.models.ref import Ref
from journal.repositories.repository import Repository


class MigratedRows(Repository[MigratedRow]):
    model = MigratedRow

    def is_brought(self, source: str) -> bool:
        return self.connection.one("SELECT 1 AS found FROM migrated_rows WHERE source = ?", (source,)) is not None

    def brought_as(self, source: str) -> Ref | None:
        """The row a version 3 row became, when it was brought across."""
        found = self.connection.one("SELECT target FROM migrated_rows WHERE source = ?", (source,))
        return None if found is None else Ref.parse(found["target"])

    def referred(self, environment: str, ref: str) -> Ref | None:
        """The row a version 3 reference such as message:185 or doc:7 became: one of the environment's rows, else one of the project's."""
        kind, _, n = ref.partition(":")
        return self.brought_as(f"environments/{environment}/{kind}/{n}") or self.brought_as(f"project/{kind}/{n}")

    def record(self, source: str, row: Model, by: Actor) -> None:
        self.save(MigratedRow(source=source, target=str(Ref.to(row))), by)
