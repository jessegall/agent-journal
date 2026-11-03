from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.comment_text.comment_text import CommentText
from core.modules.documents.models.comment_selection import CommentSelection
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.doc_revisions import DocRevisions
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message

QUOTE_LIMIT_CHARACTERS = 200


class CommentTextHandler(Handler[CommentText, Message]):
    """Sends the comment as a chat message naming the row and the selection, so the agent reads it, links the
    message to the row, and for a document or a report keeps the words and the selection apart."""

    command = CommentText

    def __init__(self, bus: Bus, queries: Queries, repository: Repository, revisions: DocRevisions) -> None:
        self.bus, self.queries, self.repository, self.revisions = bus, queries, repository, revisions

    def handle(self, command: CommentText, context: Context) -> Message:
        body = command.text.strip()
        if not body:
            raise Refusal("give the comment's text")
        text_row = self.queries.query(command.text_model).find(command.row_id)
        quoted = f'"{command.quote[:QUOTE_LIMIT_CHARACTERS]}": ' if command.quote else ""
        message = self.bus.dispatch(SendMessage(f"{quoted}{body}", commented_row=(text_row.model_name, text_row.id)), context)
        self.repository.save(Link(creator_id=context.actor.id, source_model=message.model_name, source_id=message.id, target_model=text_row.model_name, target_id=text_row.id,
                                  link_type=LinkType.COMMENT), context)
        if isinstance(text_row, TextRow):
            self.repository.save(CommentSelection(message_id=message.id, creator_id=context.actor.id, body=body, quote=command.quote, position=command.position,
                                                  selection_type=command.selection_type, revision=self.revision(text_row)), context)
        return message

    def revision(self, text_row: TextRow) -> int | None:
        latest = self.revisions.latest(text_row.id) if isinstance(text_row, Doc) else None
        return latest.number if latest else None
