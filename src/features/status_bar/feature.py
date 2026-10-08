from features.base import Feature
from features.journal import Journal
from features.status_bar.details import StatusLineDetails
from features.status_bar.handlers import RefreshUsage, WriteBar
from features.status_bar.commands import ShowBar
from features.status_bar.routes import get_bar


class StatusLine(Feature):
    details = StatusLineDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_bar)
        journal.commands.add("agent", ShowBar())
        journal.events.handler(WriteBar())
        journal.events.handler(RefreshUsage())
