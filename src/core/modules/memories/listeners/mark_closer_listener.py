from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.memories.support.mark_closer import MarkCloser
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.modules.memories.models.memory import Memory


class MarkCloserListener(SaveListener[Changed[Memory]]):
    """An agent that makes, weighs, corrects or removes a memory while its mark is open closes the mark as
    weighed."""

    name = "memories.mark-closer"

    def __init__(self, closer: MarkCloser) -> None:
        self.closer = closer

    def handle(self, event: Changed[Memory], context: Context) -> None:
        self.closer.close(context)
