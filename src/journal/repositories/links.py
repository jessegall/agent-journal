from journal.models.link import Link
from journal.models.model import Model
from journal.support.ref import Ref
from journal.repositories.repository import Repository


class Links(Repository[Link]):
    model = Link

    def of(self, model: Model) -> list[Link]:
        """Every link from or to this row."""
        ref = str(Ref.to(model))
        return self.selected("source = ? OR target = ? ORDER BY id", (ref, ref))

    def targets(self, model: Model, kind: str) -> list[Ref]:
        return [link.target for link in self.selected("source = ? AND kind = ? ORDER BY id", (str(Ref.to(model)), kind))]

    def every_target(self, model: Model) -> list[Ref]:
        """What the model links to, by a link of any kind."""
        return [link.target for link in self.selected("source = ? ORDER BY id", (str(Ref.to(model)),))]

    def every_source(self, model: Model) -> list[Ref]:
        """What links to the model, by a link of any kind."""
        return [link.source for link in self.selected("target = ? ORDER BY id", (str(Ref.to(model)),))]

    def linked(self, column: str, models: list[Model], kind: str) -> list[Link]:
        """The links of one kind whose source or target, the column named, is any of these rows: one query for them all."""
        if not models:
            return []
        refs = [str(Ref.to(model)) for model in models]
        return self.selected(f"{column} IN ({', '.join('?' for _ in refs)}) AND kind = ? ORDER BY id", (*refs, kind))

    def sources(self, model: Model, kind: str) -> list[Ref]:
        return [link.source for link in self.selected("target = ? AND kind = ? ORDER BY id", (str(Ref.to(model)), kind))]

    def is_row(self, ref: Ref) -> bool:
        """Whether the row a ref names is there, so a link never points at nothing."""
        return self.connection.one(f"SELECT 1 AS found FROM {ref.type} WHERE id = ?", (ref.id,)) is not None

    def between(self, source: Model, target: Model) -> list[Link]:
        return self.where(source=Ref.to(source), target=Ref.to(target))

    def remove_all_of(self, model: Model) -> None:
        ref = str(Ref.to(model))
        self.connection.execute(f"DELETE FROM {self.table} WHERE source = ? OR target = ?", (ref, ref))
