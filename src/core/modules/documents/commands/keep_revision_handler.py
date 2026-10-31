from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.keep_revision import KeepRevision
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.documents.support.doc_revisions import DocRevisions


class KeepRevisionHandler(Handler[KeepRevision, DocRevision]):
    """Closes a document's open revision at once."""

    command = KeepRevision

    def __init__(self, revisions: DocRevisions, repository: Repository) -> None:
        self.revisions, self.repository = revisions, repository

    def handle(self, command: KeepRevision, context: Context) -> DocRevision:
        latest = self.revisions.latest(command.doc_id)
        if latest is None:
            raise Refusal(f"doc {command.doc_id} has no revision to keep yet: its first edit opens one", "edit it first")
        if latest.closes_at <= context.timestamp:
            raise Refusal(f"revision {latest.number} of doc {command.doc_id} is already saved", "its next edit opens a new one")
        return self.repository.save(latest.changed(closes_at=context.timestamp), context)
