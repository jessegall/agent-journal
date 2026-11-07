from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.commands.tag_message.tag_message import TagMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_captions import MessageCaptions


class TagMessageHandler(Handler[TagMessage, Message]):
    """Keeps what an attached file shows on the message."""

    command = TagMessage

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: TagMessage, context: Context) -> Message:
        message = self.queries.query(Message).find(command.message_id)
        if command.file not in message.files:
            raise Refusal(f"message {message.id} has no file {command.file}", f"it has: {', '.join(message.files) or 'none'}")
        return self.repository.update(message, context, captions=MessageCaptions.adding(message, command.file, command.text))
