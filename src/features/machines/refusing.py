from events.asking import RowSaving
from receiving import Refuser
from resources.base import Refused


class StaleWrites(Refuser[RowSaving]):
    def refuse(self, event: RowSaving) -> None:
        if event.updated != event.unchanged_since:
            raise Refused(f"{event.type} {event.n} changed after you last saw it; look at it again before you change it")
