from journal.models.link import Link
from journal.models.model import Model
from journal.support.ref import Ref
from journal.repositories.repository import Repository


class Links(Repository[Link]):
    model = Link

    def link_rows(self, model: Model) -> list[Link]:
        ref = str(Ref.build(model))
        return self.selected("source = ? OR target = ? ORDER BY id", (ref, ref))

    def targets(self, model: Model, kind: str) -> list[Ref]:
        return [link.target for link in self.selected("source = ? AND kind = ? ORDER BY id", (str(Ref.build(model)), kind))]

    def all_targets(self, model: Model) -> list[Ref]:
        return [link.target for link in self.selected("source = ? ORDER BY id", (str(Ref.build(model)),))]

    def all_sources(self, model: Model) -> list[Ref]:
        return [link.source for link in self.selected("target = ? ORDER BY id", (str(Ref.build(model)),))]

    def linked(self, column: str, models: list[Model], kind: str) -> list[Link]:
        if not models:
            return []
        refs = [str(Ref.build(model)) for model in models]
        return self.selected(f"{column} IN ({', '.join('?' for _ in refs)}) AND kind = ? ORDER BY id", (*refs, kind))

    def sources(self, model: Model, kind: str) -> list[Ref]:
        return [link.source for link in self.selected("target = ? AND kind = ? ORDER BY id", (str(Ref.build(model)), kind))]

    def is_row(self, ref: Ref) -> bool:
        return self.connection.one(f"SELECT 1 AS found FROM {ref.type} WHERE id = ?", (ref.id,)) is not None

    def connecting(self, source: Model, target: Model) -> list[Link]:
        return self.matching(source=Ref.build(source), target=Ref.build(target))

    def remove_links(self, model: Model) -> None:
        ref = str(Ref.build(model))
        self.connection.execute(f"DELETE FROM {self.table} WHERE source = ? OR target = ?", (ref, ref))
