from features.base import Feature
from features.journal import Journal
from features.start.details import StartDetails
from features.start.handlers import GreetOnce, RebuildStartBlock


class Start(Feature):
    details = StartDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GreetOnce())
        journal.events.handler(RebuildStartBlock())
