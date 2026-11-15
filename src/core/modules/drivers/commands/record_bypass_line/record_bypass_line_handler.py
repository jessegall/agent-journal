from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.record_bypass_line.record_bypass_line import RecordBypassLine
from engine.model.model import Model
from core.modules.drivers.agent_messages.hooks_unchecked_message import HooksUncheckedMessage
from engine.driver.message_sender import MessageSender

LINE_SOURCE = "drivers.bypass"


class RecordBypassLineHandler(Handler[RecordBypassLine, Model]):
    """Saves the line, which waits for the agent's next hook."""

    command = RecordBypassLine

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, command: RecordBypassLine, context: Context) -> Model:
        return self.message_sender.send(command.agent_id, HooksUncheckedMessage.declared(), LINE_SOURCE, context, count=command.count)
