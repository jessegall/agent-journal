from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.processes.commands.lift_unreadable.lift_unreadable import LiftUnreadable
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.unreadable.unreadable_mark_registry import UnreadableMarkRegistry


class LiftUnreadableHandler(Handler[LiftUnreadable, UnreadableMark]):
    """Lifts a mark and keeps who lifted it."""

    command = LiftUnreadable

    def __init__(self, marks: UnreadableMarkRegistry) -> None:
        self.marks = marks

    def handle(self, command: LiftUnreadable, context: Context) -> UnreadableMark:
        return self.marks.lift(command.terms, context.actor.id, context)
