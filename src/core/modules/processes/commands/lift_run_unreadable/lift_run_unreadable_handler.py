from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.lift_run_unreadable.lift_run_unreadable import LiftRunUnreadable
from core.modules.processes.models.process import Process
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.reading.reading_notices import ReadingNotices
from core.modules.processes.support.reading.run_command_words import RunCommandWords
from core.modules.processes.support.reading.unreadable_marks import UnreadableMarks

SOURCE = "processes.readable-by-person"


class LiftRunUnreadableHandler(Handler[LiftRunUnreadable, UnreadableMark]):
    """Lifts the mark of the command of a run for the person who pressed the card's button, and tells the run's
    agent that its reader asks resume."""

    command = LiftRunUnreadable

    def __init__(self, rows: EventRows, words: RunCommandWords, marks: UnreadableMarks, nudger: Nudger) -> None:
        self.rows, self.words, self.marks, self.nudger = rows, words, marks, nudger

    def handle(self, command: LiftRunUnreadable, context: Context) -> UnreadableMark:
        process = self.rows.required(Process, command.process_id)
        mark = self.marks.lift(self.words.words(process), context.actor.id, context)
        for nudge in ReadingNotices.mark_nudges(process, (mark,)):
            self.nudger.send_nudge(process.session_agent_id, nudge, SOURCE, context)
        return mark
