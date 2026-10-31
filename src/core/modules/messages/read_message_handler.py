from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.messages.read_message import ReadMessage
from core.modules.messages.message import Message


class ReadMessageHandler(Handler[ReadMessage, Message]):
    """Marks a message read, once; reading it again changes nothing."""

    command = ReadMessage

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ReadMessage, context: Context) -> Message:
        message = self.queries.query(Message).find(command.message_id)
        if message.read_at is not None:
            return message
        return self.repository.save(message.changed(read_at=context.timestamp), context)
