from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.memories.support.mark_tracker import MarkTracker


class MarkCloser:
    """Closes the open marks of the agent acting in a context as weighed."""

    def __init__(self, marks: MarkTracker, repository: Repository) -> None:
        self.marks, self.repository = marks, repository

    def close(self, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        for mark in self.marks.open_marks(context.actor.id):
            self.repository.save(mark.weigh(context.timestamp, context.actor), context)
