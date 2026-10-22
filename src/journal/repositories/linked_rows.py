from typing import ClassVar

from journal.models.link import Link
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.repositories.links import Links
from journal.support.actor import Actor


class LinkedRows:
    """Rows that belong to another row by a link of one kind, as revisions to a document or proofs to a task: saved with their link, and read back by it."""

    link_kind: ClassVar[str]
    links: Links

    def added(self, row: Model, parent: Model, actor: Actor) -> Model:
        saved = self.save(row, actor)
        self.links.save(Link(source=Ref.build(saved), target=Ref.build(parent), kind=self.link_kind), actor)
        return saved

    def children(self, parent: Model) -> list:
        return self.numbered(ref.id for ref in self.links.sources(parent, self.link_kind))
