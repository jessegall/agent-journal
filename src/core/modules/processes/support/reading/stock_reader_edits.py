from collections.abc import Iterable

from engine.actor.actor import CORE_ACTOR_ID
from engine.event.event_log import EventLog
from core.modules.processes.models.reader import Reader

READER_FIELDS = frozenset({"type", "commands", "lines_pattern", "script", "progress_pattern", "finished_pattern", "failed_pattern", "summary_pattern",
                           "topic_pattern", "title", "subject", "step_pattern", "count_pattern", "count_command"})


class StockReaderEdits:
    """Finds the readers whose patterns or commands someone other than the core changed, so an edited stock reader
    keeps the edit and counts as a reader of the project."""

    def __init__(self, events: EventLog) -> None:
        self.events = events

    def edited_ids(self, readers: Iterable[Reader]) -> frozenset[int]:
        return frozenset(event.row_id for event in self.events.row_events_many("readers", [reader.id for reader in readers])
                         if event.event == "reader.update" and event.actor_id != CORE_ACTOR_ID and bool(READER_FIELDS.intersection(event.data)))
