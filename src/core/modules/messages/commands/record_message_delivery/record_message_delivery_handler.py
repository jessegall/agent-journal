from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.message import Message


class RecordMessageDeliveryHandler(Handler[RecordMessageDelivery, list[Message]]):
    """Saves when the agent was told of messages, on the rows the delivery read, so a message changed meanwhile is
    refused as stale; only the agent reading a message marks it read."""

    command = RecordMessageDelivery

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordMessageDelivery, context: Context) -> list[Message]:
        return self.repository.update_many(command.messages, context, delivered_at=context.timestamp)
