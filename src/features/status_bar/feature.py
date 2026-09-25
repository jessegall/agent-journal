from features.base import Feature
from features.journal import Journal
from features.status_bar.details import StatusLineDetails
from features.status_bar.handlers import MarkTestRuns, RefreshUsage, WriteBar


class StatusLine(Feature):
    details = StatusLineDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(WriteBar())
        journal.events.handler(RefreshUsage())
        journal.events.handler(MarkTestRuns())
