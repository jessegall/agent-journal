from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.mark_run_unreadable.mark_run_unreadable import MarkRunUnreadable
from core.modules.processes.models.enums.unreadable_reason import UnreadableReason
from core.modules.processes.models.process import Process
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.reading_notices.reading_notices import ReadingNotices
from core.modules.processes.support.reading.run_command_words import RunCommandWords
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks

SOURCE = "processes.unreadable-by-person"


class MarkRunUnreadableHandler(Handler[MarkRunUnreadable, UnreadableMark]):
    """Marks the command of a run for the user who pressed the card's button, and tells the run's agent that
    its reader asks stop."""

    command = MarkRunUnreadable

    def __init__(self, rows: EventRows, terms: RunCommandWords, marks: UnreadableMarks, nudger: Nudger) -> None:
        self.rows, self.words, self.marks, self.nudger = rows, terms, marks, nudger

    def handle(self, command: MarkRunUnreadable, context: Context) -> UnreadableMark:
        process = self.rows.required(Process, command.process_id)
        mark = self.marks.mark(context.actor.id, self.words.words(process), UnreadableReason.DECLARED, "", context)
        for nudge in ReadingNotices.mark_nudges(process, tuple([mark])):
            self.nudger.send_nudge(process.session_agent_id, nudge, SOURCE, context)
        return mark
