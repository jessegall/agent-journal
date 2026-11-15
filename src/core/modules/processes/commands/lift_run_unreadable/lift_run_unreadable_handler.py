from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.message_sender import MessageSender
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.lift_run_unreadable.lift_run_unreadable import LiftRunUnreadable
from core.modules.processes.models.process import Process
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.reading_notices.reading_notices import ReadingNotices
from core.modules.processes.support.reading.run_command_terms import RunCommandTerms
from core.modules.processes.support.unreadable.unreadable_mark_registry import UnreadableMarkRegistry

SOURCE = "processes.readable-by-person"


class LiftRunUnreadableHandler(Handler[LiftRunUnreadable, UnreadableMark]):
    """Lifts the mark of the command of a run for the user who pressed the card's button, and tells the run's
    agent that its reader asks resume."""

    command = LiftRunUnreadable

    def __init__(self, rows: EventRows, terms: RunCommandTerms, marks: UnreadableMarkRegistry, message_sender: MessageSender) -> None:
        self.rows, self.words, self.marks, self.message_sender = rows, terms, marks, message_sender

    def handle(self, command: LiftRunUnreadable, context: Context) -> UnreadableMark:
        process = self.rows.required(Process, command.process_id)
        mark = self.marks.lift(self.words.words(process), context.actor.id, context)
        for agent_message in ReadingNotices.mark_agent_messages(process, tuple([mark])):
            self.message_sender.send_agent_message(process.session_agent_id, agent_message, SOURCE, context)
        return mark
