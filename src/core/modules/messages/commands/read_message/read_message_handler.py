from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.messages.models.message import Message
from core.base.actor_type import ActorType
from core.base.refusal import Refusal
from core.modules.messages.queries.message_query import MessageQuery


class ReadMessageHandler(Handler[ReadMessage, Message]):
    """Marks a message read, once; reading it again changes nothing."""

    command = ReadMessage

    def __init__(self, queries: Queries, repository: Repository, messages: MessageQuery) -> None:
        self.queries, self.repository = queries, repository
        self.messages = messages

    def handle(self, command: ReadMessage, context: Context) -> Message:
        message = self.queries.query(Message).find(command.message_id)
        if context.actor.type is ActorType.AGENT and not self.messages.addressed(context.actor.id, message.environment_id).filter(id=message.id).exists():
            raise Refusal("this message is addressed to another agent", "read your messages with journal message unread")
        if message.read_at is not None:
            return message
        return self.repository.save(message.changed(read_at=context.timestamp), context)
