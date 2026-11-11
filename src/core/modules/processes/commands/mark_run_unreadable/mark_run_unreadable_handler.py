from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.mark_run_unreadable.mark_run_unreadable import MarkRunUnreadable
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.process import Process
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.process_nudges import UNREADABLE_DECLARED
from core.modules.processes.support.reading.run_command_words import RunCommandWords
from core.modules.processes.support.reading.unreadable_marks import UnreadableMarks

SOURCE = "processes.unreadable-by-person"


class MarkRunUnreadableHandler(Handler[MarkRunUnreadable, UnreadableMark]):
    """Marks the command of a run for the person who pressed the card's button, and tells the run's agent that
    its reader asks stop."""

    command = MarkRunUnreadable

    def __init__(self, rows: EventRows, words: RunCommandWords, marks: UnreadableMarks, nudger: Nudger) -> None:
        self.rows, self.words, self.marks, self.nudger = rows, words, marks, nudger

    def handle(self, command: MarkRunUnreadable, context: Context) -> UnreadableMark:
        process = self.rows.required(Process, command.process_id)
        mark = self.marks.mark(context.actor.id, self.words.words(process), UnreadableReason.DECLARED, "", context)
        self.nudger.send(process.session_agent_id, UNREADABLE_DECLARED, SOURCE, context, name=mark.words)
        return mark
