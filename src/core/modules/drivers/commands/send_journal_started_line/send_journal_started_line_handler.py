from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line import SendJournalStartedLine
from core.modules.drivers.nudges.journal_started_message import JournalStartedMessage
from engine.driver.nudger import MessageSender

SOURCE = "drivers.journal-started"


class SendJournalStartedLineHandler(Handler[SendJournalStartedLine, None]):
    """Gives the agent the line that wakes it."""

    command = SendJournalStartedLine

    def __init__(self, nudger: MessageSender) -> None:
        self.nudger = nudger

    def handle(self, command: SendJournalStartedLine, context: Context) -> None:
        self.nudger.send(command.agent_id, JournalStartedMessage.declared(), SOURCE, context)
