from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.memories.support.mark_closer import MarkCloser


class MarkCloserListener(SaveListener):
    """An agent that makes, weighs, corrects or removes a memory while its mark is open closes the mark as
    weighed."""

    name = "memories.mark-closer"
    event = "memory.*"

    def __init__(self, closer: MarkCloser) -> None:
        self.closer = closer

    def handle(self, change: Change[Model]) -> None:
        self.closer.close(change.context)
