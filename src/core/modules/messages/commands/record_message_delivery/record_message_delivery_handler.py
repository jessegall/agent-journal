from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.message import Message


class RecordMessageDeliveryHandler(Handler[RecordMessageDelivery, Message]):
    """Saves when the agent was told of a message, on the row the delivery read, so a message changed meanwhile is
    refused as stale; only the agent reading the message marks it read."""

    command = RecordMessageDelivery

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordMessageDelivery, context: Context) -> Message:
        return self.repository.update(command.message, context, delivered_at=context.timestamp)
