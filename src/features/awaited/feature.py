from features.awaited.details import AwaitedDetails
from features.awaited.handlers import ReturnWhenAwaitedReport
from features.base import Feature
from features.journal import Journal


class Awaited(Feature):
    details = AwaitedDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ReturnWhenAwaitedReport())
