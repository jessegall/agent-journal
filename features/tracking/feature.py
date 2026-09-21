from features.base import Feature
from features.tracking.details import TrackingDetails
from features.tracking.handlers import NameUncitedSource
from features.journal import Journal


class Tracking(Feature):
    details = TrackingDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameUncitedSource())
