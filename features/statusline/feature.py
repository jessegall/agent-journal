from features.base import Feature
from features.journal import Journal
from features.statusline.details import StatusLineDetails
from features.statusline.handlers import RefreshUsage, WriteBar


class StatusLine(Feature):
    details = StatusLineDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(WriteBar())
        journal.events.handler(RefreshUsage())
