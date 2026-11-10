from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.messages.models.message import Message
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.messages.support.work_sources import WorkSources


class ReadMessageHandler(Handler[ReadMessage, Message]):
    """Marks a message read, once; reading it again changes nothing."""

    command = ReadMessage

    def __init__(self, rows: EventRows, repository: Repository, messages: MessageQuery, sources: WorkSources) -> None:
        self.rows, self.repository = rows, repository
        self.messages = messages
        self.sources = sources

    def handle(self, command: ReadMessage, context: Context) -> Message:
        message = self.mark(command.message_id, context)
        self.sources.select_first(message, context)
        return message

    def mark(self, message_id: int, context: Context) -> Message:
        message = self.rows.required(Message, message_id)
        if context.actor.type is ActorType.AGENT and not self.messages.addressed(context.actor.id).filter(id=message.id).exists():
            raise Refusal("this message is addressed to another agent", "read your messages with journal message unread")
        if message.read_at is not None:
            return message
        return self.repository.update(message, context, read_at=context.timestamp)
