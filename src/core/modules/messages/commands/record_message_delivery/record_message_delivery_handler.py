from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.models.message import Message


class RecordMessageDeliveryHandler(Handler[RecordMessageDelivery, Message]):
    """Saves when the agent was told of a message; it reads the message itself, and only that marks it read.
    """

    command = RecordMessageDelivery

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordMessageDelivery, context: Context) -> Message:
        return self.repository.update(self.rows.required(Message, command.message_id), context, delivered_at=context.timestamp)
