from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.support.sequence_events import SequenceEvents


class SequenceEventIndexListener(SaveListener[Changed[Sequence]]):
    name = "sequences.event-index"

    def __init__(self, events: SequenceEvents) -> None:
        self.events = events

    def handle(self, event: Changed[Sequence], context: Context) -> None:
        if isinstance(event, Deleted):
            self.events.remove(event.row.id)
            return
        self.events.remember(event.row)
