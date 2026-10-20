from journal.events.listener import Listener
from journal.events.models.saved import Saved
from journal.support.telling import Telling
from journal.models.dump import Dump
from journal.repositories.dumps import Dumps


class TellArrival(Listener[Saved]):
    """What the user drops in the dump in hand reaches the agent with how many items wait to be read."""

    def __init__(self, dumps: Dumps, telling: Telling) -> None:
        self.dumps, self.telling = dumps, telling

    def handle(self, event: Saved) -> None:
        from journal.features.dumps.feature import DumpsFeature
        dump = event.model
        if not isinstance(dump, Dump) or not event.by.is_the_user() or dump.is_completed:
            return
        in_hand, waiting = self.dumps.in_hand(), dump.waiting()
        if in_hand and in_hand.id == dump.id and waiting:
            self.telling.tell(DumpsFeature.ARRIVED.create(n=dump.id, count=Dump.items_in(waiting)))
