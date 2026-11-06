from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.comment_text.comment_text import CommentText
from core.modules.documents.models.comment_selection import CommentSelection
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.doc_revisions import DocRevisions
from core.modules.documents.support.row_link_writer import RowLinkWriter
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message

QUOTE_LIMIT_CHARACTERS = 200


class CommentTextHandler(Handler[CommentText, Message]):
    """Sends a comment to the agent, links it to the row and keeps any text selection separately."""

    command = CommentText

    def __init__(self, bus: Bus, rows: EventRows, repository: Repository, revisions: DocRevisions, links: RowLinkWriter) -> None:
        self.bus, self.rows, self.repository, self.revisions = bus, rows, repository, revisions
        self.links = links

    def handle(self, command: CommentText, context: Context) -> Message:
        body = command.text.strip()
        if not body:
            raise Refusal("give the comment's text")
        text_row = self.rows.required(command.text_model, command.row_id)
        quoted = f'"{command.quote[:QUOTE_LIMIT_CHARACTERS]}": ' if command.quote else ""
        message = self.bus.dispatch(SendMessage(f"{quoted}{body}", commented_row=(text_row.model_name, text_row.id), is_chat_visible=command.is_chat_visible), context)
        self.links.save(Link(creator_id=context.actor.id, source_model=message.model_name, source_id=message.id, target_model=text_row.model_name, target_id=text_row.id,
                                  link_type=LinkType.COMMENT), context)
        if isinstance(text_row, TextRow):
            self.repository.save(CommentSelection(message_id=message.id, creator_id=context.actor.id, body=body, quote=command.quote, position=command.position,
                                                  selection_type=command.selection_type, revision=self.revision(text_row)), context)
        return message

    def revision(self, text_row: TextRow) -> int | None:
        latest = self.revisions.latest(text_row.id) if isinstance(text_row, Doc) else None
        return latest.number if latest else None
