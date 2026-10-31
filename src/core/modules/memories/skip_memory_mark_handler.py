from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.memories.memory_mark import MemoryMark
from core.modules.memories.mark_tracker import MarkTracker
from core.modules.memories.skip_memory_mark import SkipMemoryMark


class SkipMemoryMarkHandler(Handler[SkipMemoryMark, MemoryMark]):
    """Closes the calling agent's open mark as skipped, with the reason given."""

    command = SkipMemoryMark

    def __init__(self, marks: MarkTracker, repository: Repository) -> None:
        self.marks, self.repository = marks, repository

    def handle(self, command: SkipMemoryMark, context: Context) -> MemoryMark:
        marks = self.marks.open_marks(context.actor.id)
        if not marks:
            raise Refusal("you have no open memory mark to skip", "a mark opens when your context window passes one")
        return self.repository.save(marks[0].skip(context.timestamp, context.actor, command.reason), context)
