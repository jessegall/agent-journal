from journal.models.link import Link
from journal.models.model import Model
from journal.models.ref import Ref
from journal.repositories.repository import Repository


class Links(Repository[Link]):
    model = Link

    def of(self, model: Model) -> list[Link]:
        """Every link from or to this row."""
        ref = str(Ref.to(model))
        return [self._load(row) for row in self.connection.all(f"SELECT * FROM {self.table} WHERE source = ? OR target = ? ORDER BY id", (ref, ref))]

    def targets(self, model: Model, kind: str = "") -> list[Ref]:
        return [link.target for link in self.of(model) if link.source == Ref.to(model) and (not kind or link.kind == kind)]

    def sources(self, model: Model, kind: str = "") -> list[Ref]:
        return [link.source for link in self.of(model) if link.target == Ref.to(model) and (not kind or link.kind == kind)]

    def between(self, source: Model, target: Model) -> list[Link]:
        return self.where(source=Ref.to(source), target=Ref.to(target))

    def remove_all_of(self, model: Model) -> None:
        ref = str(Ref.to(model))
        self.connection.execute(f"DELETE FROM {self.table} WHERE source = ? OR target = ?", (ref, ref))
