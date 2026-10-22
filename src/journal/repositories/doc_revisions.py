from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.doc import Doc
from journal.models.doc_revision import DocRevision
from journal.repositories.linked_rows import LinkedRows
from journal.repositories.links import Links
from journal.repositories.repository import Repository
from journal.support.actor import Actor
from journal.support.rejection import Rejection

REVISION_LINK = "revision_of"


class DocRevisions(Repository[DocRevision], LinkedRows):
    """A document's revisions, each linked to it, read in their order."""

    link_kind = REVISION_LINK
    model = DocRevision

    def __init__(self, connection: Connection, bus: Bus, links: Links) -> None:
        super().__init__(connection, bus)
        self.links = links

    def document_revisions(self, doc: Doc) -> list[DocRevision]:
        return sorted(self.children(doc), key=lambda revision: revision.number)

    def latest(self, doc: Doc) -> DocRevision | None:
        revisions = self.document_revisions(doc)
        return revisions[-1] if revisions else None

    def close(self, doc: Doc, time: float, actor: Actor) -> DocRevision:
        latest = self.latest(doc)
        if latest is None:
            raise Rejection(f"doc {doc.id} has no revision to keep yet: its first edit opens one")
        if not latest.is_open(time):
            raise Rejection(f"revision {latest.number} of doc {doc.id} is already kept")
        return self.save(latest.closed(), actor)
