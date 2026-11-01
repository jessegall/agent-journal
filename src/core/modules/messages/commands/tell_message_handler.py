from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.messages.commands.tell_message import TellMessage
from core.modules.messages.models.message import Message


class TellMessageHandler(Handler[TellMessage, Message]):
    """Saves when the agent was told of a message; it reads the message itself, and only that marks it read."""

    command = TellMessage

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: TellMessage, context: Context) -> Message:
        return self.repository.save(self.queries.query(Message).find(command.message_id).changed(told_at=context.timestamp), context)
