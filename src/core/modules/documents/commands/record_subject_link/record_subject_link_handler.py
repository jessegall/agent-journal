from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.messages.models.message import Message


class RecordSubjectLinkHandler(Handler[RecordSubjectLink, None]):
    """Saves the link from a message to the row, once."""

    command = RecordSubjectLink

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordSubjectLink, context: Context) -> None:
        link_fields = {"source_model": Message.model_name, "source_id": command.message_id, "target_model": command.target_model, "target_id": command.target_id}
        if self.queries.query(Link).filter(**link_fields).count():
            return
        self.repository.save(Link(creator_id=context.actor.id, link_type=LinkType.SUBJECT, **link_fields), context)
