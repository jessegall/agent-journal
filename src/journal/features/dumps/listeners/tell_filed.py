from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.typed_nudges import TypedNudges
from journal.models.dump import Dump
from journal.repositories.dumps import Dumps


class TellFiled(Listener[Updated]):
    """A dump that closes is told to the agent to sum up, and the next one waiting is handed to it."""

    def __init__(self, dumps: Dumps, typed: TypedNudges) -> None:
        self.dumps, self.typed = dumps, typed

    def handle(self, event: Updated) -> None:
        from journal.features.dumps.feature import DumpsFeature
        dump = event.model
        if not isinstance(dump, Dump) or not dump.is_completed or event.was.is_completed:
            return
        if not dump.stopped:
            self.typed.type(DumpsFeature.DUMP_FILED_SUM_IT_UP.create(n=dump.id, outcome=dump.outcome))
        next_up = self.dumps.in_hand()
        if next_up and next_up.waiting():
            self.typed.type(DumpsFeature.DUMP_ARRIVED_FILE_IT.create(n=next_up.id, count=Dump.items_in(next_up.waiting())))
