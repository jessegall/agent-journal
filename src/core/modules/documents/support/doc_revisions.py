from core.base.command.context import Context
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.support.revision_change import RevisionChange

FIRST_CHANGE = "first version"


class DocRevisions:
    """Groups an author's edits until close and saves each viewer edit as a separate revision."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def latest(self, doc_id: int) -> DocRevision | None:
        return self.queries.query(DocRevision).filter(doc_id=doc_id).descending("number").first()

    def record(self, doc: Doc, context: Context) -> None:
        opened = self.queries.query(OpenDocument).filter(doc_id=doc.id, author_id=context.actor.id).first()
        if context.actor.type is not ActorType.AGENT or opened is None:
            self.record_standalone(doc, context)
            return
        if opened.revision_id is None:
            revision = self.record_standalone(doc, context)
            if revision is not None:
                self.repository.update(opened, context, revision_id=revision.id)
            return
        revision = self.queries.query(DocRevision).find(opened.revision_id)
        self.repository.update(revision, context, title=doc.title, abstract=doc.abstract, body=doc.body)

    def require_open(self, doc: Doc, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        opened = self.queries.query(OpenDocument).filter(doc_id=doc.id, author_id=context.actor.id).first()
        if opened is None:
            raise Refusal(f"doc {doc.id} needs an open revision; journal doc open {doc.id}")

    def record_standalone(self, doc: Doc, context: Context) -> DocRevision | None:
        latest = self.latest(doc.id)
        if latest is not None and (latest.title, latest.abstract, latest.body) == (doc.title, doc.abstract, doc.body):
            return
        number, change = (1, FIRST_CHANGE) if latest is None else (latest.number + 1, RevisionChange.text(latest, doc))
        return self.repository.save(DocRevision(doc_id=doc.id, creator_id=context.actor.id, author_id=context.actor.id, number=number, title=doc.title, abstract=doc.abstract, body=doc.body,
                                         change=change, closes_at=context.timestamp), context)
