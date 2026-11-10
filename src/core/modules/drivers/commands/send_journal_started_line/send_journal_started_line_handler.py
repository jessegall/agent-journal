from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.send_journal_started_line.send_journal_started_line import SendJournalStartedLine
from core.modules.drivers.support.driver_nudges import JOURNAL_STARTED
from core.modules.drivers.support.nudger import Nudger

SOURCE = "drivers.journal-started"


class SendJournalStartedLineHandler(Handler[SendJournalStartedLine, None]):
    """Gives the agent the line that wakes it."""

    command = SendJournalStartedLine

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, command: SendJournalStartedLine, context: Context) -> None:
        self.nudger.send(command.agent_id, JOURNAL_STARTED, SOURCE, context)
