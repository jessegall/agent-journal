from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.query.queries import Queries
from engine.enums.actor_type import ActorType
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.commands.keep_revision.keep_revision import KeepRevision
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.support.doc_revisions import DocRevisions


class KeepRevisionHandler(Handler[KeepRevision, DocRevision]):
    """Closes a revision for its author or a person using the viewer."""

    command = KeepRevision

    def __init__(self, revisions: DocRevisions, repository: Repository, queries: Queries) -> None:
        self.revisions, self.repository, self.queries = revisions, repository, queries

    def handle(self, command: KeepRevision, context: Context) -> DocRevision:
        opened = self.queries.query(OpenDocument).filter(doc_id=command.doc_id).first()
        if opened is not None:
            if context.actor.type is ActorType.AGENT and opened.author_id != context.actor.id:
                raise Refusal(f"doc {command.doc_id} is open by agent {opened.author_id}")
            latest = self.queries.query(DocRevision).find(opened.revision_id) if opened.revision_id is not None else self.revisions.latest(command.doc_id)
            if latest is None:
                raise Refusal(f"doc {command.doc_id} has no saved text")
            if opened.revision_id is not None:
                latest = self.repository.update(latest, context, closes_at=context.timestamp)
            self.repository.delete(opened, context)
            return latest
        latest = self.revisions.latest(command.doc_id)
        if latest is None:
            raise Refusal(f"doc {command.doc_id} has no revision to keep yet: its first edit opens one", "edit it first")
        return latest
