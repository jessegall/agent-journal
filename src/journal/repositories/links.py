from collections.abc import Sequence

from journal.db.query import Query
from journal.models.link import Link
from journal.support.actor import Actor
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.repositories.repository import Repository


class Links(Repository[Link]):
    model = Link

    def link_rows(self, model: Model) -> list[Link]:
        return self.selected(self.touching(model).order("id"))

    def targets(self, model: Model, kind: str) -> list[Ref]:
        return [link.target for link in self.selected(self.query().filter(source=Ref.build(model), kind=kind).order("id"))]

    def all_targets(self, model: Model) -> list[Ref]:
        return [link.target for link in self.selected(self.query().filter(source=Ref.build(model)).order("id"))]

    def all_sources(self, model: Model) -> list[Ref]:
        return [link.source for link in self.selected(self.query().filter(target=Ref.build(model)).order("id"))]

    def model_links(self, column: str, models: Sequence[Model], kind: str) -> list[Link]:
        if not models:
            return []
        return self.selected(self.query().filter_listed(column, [Ref.build(model) for model in models]).filter(kind=kind).order("id"))

    def targets_except(self, model: Model, kind: str, refs: set[Ref]) -> list[Ref]:
        return [ref for ref in self.targets(model, kind) if ref not in refs]

    def typed_sources(self, model: Model, kind: str, table: str) -> list[Ref]:
        return [ref for ref in self.sources(model, kind) if ref.type == table]

    def source_links(self, model: Model, kind: str) -> list[Link]:
        return self.selected(self.query().filter(source=Ref.build(model), kind=kind).order("id"))

    def sources(self, model: Model, kind: str) -> list[Ref]:
        return [link.source for link in self.selected(self.query().filter(target=Ref.build(model), kind=kind).order("id"))]

    def connecting(self, source: Model, target: Model) -> list[Link]:
        return self.matching(source=Ref.build(source), target=Ref.build(target))

    def remove_links(self, model: Model, actor: Actor) -> None:
        self.purged_rows(Link, self.touching(model), actor)

    def touching(self, model: Model) -> Query:
        ref = Ref.build(model)
        return self.query().filter_alternatives(self.query().filter(source=ref), self.query().filter(target=ref))
