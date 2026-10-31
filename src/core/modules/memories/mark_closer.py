from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.repository.repository import Repository
from core.modules.memories.mark_tracker import MarkTracker


class MarkCloser(SaveListener):
    """An agent that makes, weighs, corrects or removes a memory while its mark is open closes the mark as weighed."""

    name = "memories.mark-closer"
    event = "memory.*"

    def __init__(self, marks: MarkTracker, repository: Repository) -> None:
        self.marks, self.repository = marks, repository

    def handle(self, change: Change[Model]) -> None:
        if change.actor.type is not ActorType.AGENT:
            return
        for mark in self.marks.open_marks(change.actor.id):
            self.repository.save(mark.weigh(change.context.timestamp, change.actor), change.context)
