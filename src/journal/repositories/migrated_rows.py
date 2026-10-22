from typing import Callable

from journal.support.actor import Actor
from journal.models.migrated_row import MigratedRow
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.repositories.repository import Repository
from journal.support.missing_row import MissingRow


class MigratedRows(Repository[MigratedRow]):
    model = MigratedRow

    def is_imported(self, source: str) -> bool:
        return bool(self.all_matching(source=source))

    def imported_ref(self, source: str) -> Ref | None:
        rows = self.all_matching(source=source)
        return Ref.parse(rows[0].target) if rows else None

    def referred(self, environment: str, ref: str) -> Ref | None:
        kind, _, n = ref.partition(":")
        return self.imported_ref(f"environments/{environment}/{kind}/{n}") or self.imported_ref(f"project/{kind}/{n}")

    def counterpart(self, environment: str, refs: tuple[str, ...]) -> Ref:
        counterpart = next((imported for ref in refs if (imported := self.referred(environment, ref))), None)
        if counterpart is None:
            raise MissingRow(self.table, ", ".join(refs))
        return counterpart

    def import_rows(self, source: str, produced: Callable[[], Model], actor: Actor) -> None:
        with self.connection.transaction():
            self.record(source, produced(), actor)

    def record(self, source: str, row: Model, actor: Actor) -> None:
        self.save(MigratedRow(source=source, target=str(Ref.build(row))), actor)
