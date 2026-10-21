from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.doc import Doc
from journal.models.doc_revision import DocRevision
from journal.models.link import Link
from journal.models.support.ref import Ref
from journal.repositories.links import Links
from journal.repositories.repository import Repository
from journal.support.actor import Actor
from journal.support.rejection import Rejection

REVISION_LINK = "revision_of"


class DocRevisions(Repository[DocRevision]):
    """A document's revisions, each linked to it, read in their order."""

    model = DocRevision

    def __init__(self, connection: Connection, bus: Bus, links: Links) -> None:
        super().__init__(connection, bus)
        self.links = links

    def document_revisions(self, doc: Doc) -> list[DocRevision]:
        return sorted(self.numbered(ref.id for ref in self.links.sources(doc, REVISION_LINK)), key=lambda revision: revision.number)

    def latest(self, doc: Doc) -> DocRevision | None:
        revisions = self.document_revisions(doc)
        return revisions[-1] if revisions else None

    def added(self, revision: DocRevision, doc: Doc, actor: Actor) -> DocRevision:
        saved = self.save(revision, actor)
        self.links.save(Link(source=Ref.build(saved), target=Ref.build(doc), kind=REVISION_LINK), actor)
        return saved

    def close(self, doc: Doc, time: float, actor: Actor) -> DocRevision:
        latest = self.latest(doc)
        if latest is None:
            raise Rejection(f"doc {doc.id} has no revision to keep yet: its first edit opens one")
        if not latest.is_open(time):
            raise Rejection(f"revision {latest.number} of doc {doc.id} is already kept")
        return self.save(latest.closed(), actor)
