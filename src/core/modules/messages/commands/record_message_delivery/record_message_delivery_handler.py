from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.message import Message


class RecordMessageDeliveryHandler(Handler[RecordMessageDelivery, Message]):
    """Saves when the agent was told of a message; it reads the message itself, and only that marks it read."""

    command = RecordMessageDelivery

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordMessageDelivery, context: Context) -> Message:
        return self.repository.save(self.queries.query(Message).find(command.message_id).changed(delivered_at=context.timestamp), context)
