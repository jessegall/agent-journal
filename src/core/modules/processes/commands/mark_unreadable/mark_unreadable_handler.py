from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.processes.commands.mark_unreadable.mark_unreadable import MarkUnreadable
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.reading.unreadable_marks import UnreadableMarks


class MarkUnreadableHandler(Handler[MarkUnreadable, UnreadableMark]):
    """Keeps the mark an agent of any role declares, refused without a reason of three words or more."""

    command = MarkUnreadable

    def __init__(self, marks: UnreadableMarks) -> None:
        self.marks = marks

    def handle(self, command: MarkUnreadable, context: Context) -> UnreadableMark:
        return self.marks.declare(context.actor.id, command.words, command.reason, context)
