from features.base import Feature
from features.journal import Journal
from features.session_briefing.details import StartDetails
from features.session_briefing.handlers import GreetOnce, RebuildStartBlock


class Start(Feature):
    details = StartDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GreetOnce())
        journal.events.handler(RebuildStartBlock())
