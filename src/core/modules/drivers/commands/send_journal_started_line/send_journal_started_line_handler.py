from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line import SendJournalStartedLine
from core.modules.drivers.agent_messages.journal_started_message import JournalStartedMessage
from engine.driver.message_sender import MessageSender

SOURCE = "drivers.journal-started"


class SendJournalStartedLineHandler(Handler[SendJournalStartedLine, None]):
    """Gives the agent the line that wakes it."""

    command = SendJournalStartedLine

    def __init__(self, message_sender: MessageSender) -> None:
        self.message_sender = message_sender

    def handle(self, command: SendJournalStartedLine, context: Context) -> None:
        self.message_sender.send(command.agent_id, JournalStartedMessage.declared(), SOURCE, context)
