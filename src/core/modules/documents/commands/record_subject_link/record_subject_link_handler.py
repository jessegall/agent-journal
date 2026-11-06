from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_link_writer import RowLinkWriter
from core.modules.messages.models.message import Message


class RecordSubjectLinkHandler(Handler[RecordSubjectLink, None]):
    """Saves the link from a message to the row, once."""

    command = RecordSubjectLink

    def __init__(self, links: RowLinkWriter) -> None:
        self.links = links

    def handle(self, command: RecordSubjectLink, context: Context) -> None:
        link = Link(creator_id=context.actor.id, source_model=Message.model_name, source_id=command.message_id, target_model=command.target_model, target_id=command.target_id, link_type=LinkType.SUBJECT)
        self.links.save_automatic([link], context)
