from journal.models.link import Link
from journal.models.model import Model
from journal.models.ref import Ref
from journal.repositories.repository import Repository


class Links(Repository[Link]):
    model = Link

    def of(self, model: Model) -> list[Link]:
        """Every link from or to this row."""
        ref = str(Ref.to(model))
        return self.selected("source = ? OR target = ? ORDER BY id", (ref, ref))

    def targets_by_source(self, table: str, kind: str) -> dict[Ref, list[Ref]]:
        """Every link of a kind from the rows of one table, in one read: what each of those rows links to."""
        found: dict[Ref, list[Ref]] = {}
        for link in self.selected("kind = ? AND source LIKE ? ORDER BY id", (kind, f"{table}:%")):
            found.setdefault(link.source, []).append(link.target)
        return found

    def targets(self, model: Model, kind: str) -> list[Ref]:
        return [link.target for link in self.of(model) if link.source == Ref.to(model) and link.kind == kind]

    def every_target(self, model: Model) -> list[Ref]:
        """What the model links to, by a link of any kind."""
        return [link.target for link in self.of(model) if link.source == Ref.to(model)]

    def every_source(self, model: Model) -> list[Ref]:
        """What links to the model, by a link of any kind."""
        return [link.source for link in self.of(model) if link.target == Ref.to(model)]

    def sources(self, model: Model, kind: str) -> list[Ref]:
        return [link.source for link in self.of(model) if link.target == Ref.to(model) and link.kind == kind]

    def between(self, source: Model, target: Model) -> list[Link]:
        return self.where(source=Ref.to(source), target=Ref.to(target))

    def remove_all_of(self, model: Model) -> None:
        ref = str(Ref.to(model))
        self.connection.execute(f"DELETE FROM {self.table} WHERE source = ? OR target = ?", (ref, ref))
