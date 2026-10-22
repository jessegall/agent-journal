from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.collection import Collection
from journal.models.link import Link
from journal.models.model import Model
from journal.models.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.rows import Rows
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.actor import Actor

MEMBER_LINK = "member"
OWNER_LINK = "collection"


class Collections(ScopedRepository[Collection]):
    """Collections and their members, each member a link from the collection to the row; a row that is gone is left out."""

    model = Collection

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links, rows: Rows) -> None:
        super().__init__(connection, bus, scope)
        self.links, self.rows = links, rows

    def members(self, collection: Collection) -> list[Ref]:
        return [ref for ref in self.links.targets(collection, MEMBER_LINK) if self.rows.is_row(ref)]

    def joined(self, collection: Collection, ref: Ref, actor: Actor) -> None:
        if ref not in self.links.targets(collection, MEMBER_LINK):
            self.links.save(Link(source=Ref.build(collection), target=ref, kind=MEMBER_LINK), actor)

    def parted(self, collection: Collection, ref: Ref, actor: Actor) -> None:
        for link in self.links.all_matching(source=Ref.build(collection), target=ref, kind=MEMBER_LINK):
            self.links.delete(link, actor)

    def owned(self, owner: Model, title: str, actor: Actor) -> Collection:
        existing = self.owner_collection(owner)
        if existing:
            return existing[0]
        collection = self.save(Collection(title=title), actor)
        self.links.save(Link(source=Ref.build(owner), target=Ref.build(collection), kind=OWNER_LINK), actor)
        return collection

    def owner_collection(self, owner: Model) -> list[Collection]:
        return [self.find(ref.id) for ref in self.links.targets(owner, OWNER_LINK)]
