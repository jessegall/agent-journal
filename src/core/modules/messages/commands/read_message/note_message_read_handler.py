from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.messages.commands.read_message.note_message_read import NoteMessageRead
from core.modules.messages.commands.read_message.read_message_handler import ReadMessageHandler
from core.modules.messages.models.message import Message


class NoteMessageReadHandler(Handler[NoteMessageRead, Message]):
    """Marks batch delivery read through the same addressee checks as an explicit read."""

    command = NoteMessageRead

    def __init__(self, reader: ReadMessageHandler, repository: Repository) -> None:
        self.reader, self.repository = reader, repository

    def handle(self, command: NoteMessageRead, context: Context) -> Message:
        message = self.reader.mark(command.message_id, context)
        if message.read_notice_at is not None:
            return message
        return self.repository.update(message, context, read_notice_at=context.timestamp)
