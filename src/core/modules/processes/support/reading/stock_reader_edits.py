from collections.abc import Iterable

from engine.actor.actor import CORE_ACTOR_ID
from engine.event.event_log import EventLog
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.stock_reader import STOCK_READERS

READER_FIELDS = frozenset({"type", "commands", "lines_pattern", "script", "progress_pattern", "finished_pattern", "failed_pattern", "summary_pattern",
                           "topic_pattern", "title", "subject", "step_pattern", "count_pattern", "count_command"})


class StockReaderEdits:
    """Finds the stock readers someone other than the core changed: by their events, read when the shipped
    readers are published, and by their difference from the shipped catalogue, which reads no event and so
    serves every choice of a reader."""

    def __init__(self, events: EventLog) -> None:
        self.events = events

    def edited_ids(self, readers: Iterable[Reader]) -> frozenset[int]:
        return frozenset(event.row_id for event in self.events.row_events_many("readers", [reader.id for reader in readers])
                         if event.event == "reader.update" and event.actor_id != CORE_ACTOR_ID and bool(READER_FIELDS.intersection(event.data)))

    @staticmethod
    def changed_from_catalogue(readers: Iterable[Reader]) -> frozenset[int]:
        catalogue = {stock.name: stock for stock in STOCK_READERS}
        return frozenset(reader.id for reader in readers if reader.creator_id == CORE_ACTOR_ID and reader.name in catalogue
                         and catalogue[reader.name].applied(reader) != reader)
