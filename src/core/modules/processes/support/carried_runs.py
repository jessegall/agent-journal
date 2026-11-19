import threading
from functools import cache

from engine.journal.journal_home import JournalHome


class CarriedRuns:
    """The merge runs this server carries out itself through the one door, from their row until their end is
    recorded: such a run has no runner folder while it waits in the merge lane, so run end recovery leaves it
    alone rather than taking it for one no runner ever started."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.process_ids: set[int] = set()

    # one set for each journal a process serves, shared by every thread
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "CarriedRuns":
        return CarriedRuns()

    def carry(self, process_id: int) -> None:
        with self.lock:
            self.process_ids.add(process_id)

    def release(self, process_id: int) -> None:
        with self.lock:
            self.process_ids.discard(process_id)

    def is_carried(self, process_id: int) -> bool:
        with self.lock:
            return process_id in self.process_ids
