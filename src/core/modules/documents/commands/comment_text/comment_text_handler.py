from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.comment_text.comment_text import CommentText
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message


class CommentTextHandler(Handler[CommentText, Message]):
    """Sends the comment as a chat message naming the row, so the agent reads it, and links the message to
    the row."""

    command = CommentText

    def __init__(self, bus: Bus, queries: Queries, repository: Repository) -> None:
        self.bus, self.queries, self.repository = bus, queries, repository

    def handle(self, command: CommentText, context: Context) -> Message:
        if not command.text.strip():
            raise Refusal("give the comment's text")
        text_row = self.queries.query(command.text_model).find(command.row_id)
        message = self.bus.dispatch(SendMessage(f"On {text_row.cli_name} {text_row.id}, {text_row.title}: {command.text.strip()}", commented_row=(text_row.model_name, text_row.id)), context)
        self.repository.save(Link(creator_id=context.actor.id, source_model=message.model_name, source_id=message.id, target_model=text_row.model_name, target_id=text_row.id,
                                  link_type=LinkType.COMMENT), context)
        return message
