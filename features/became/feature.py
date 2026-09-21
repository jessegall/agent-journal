from features.base import Feature
from features.became.details import BecameDetails
from features.became.handlers import NameUncitedSource
from features.journal import Journal


class Became(Feature):
    details = BecameDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameUncitedSource())
