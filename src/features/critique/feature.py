from features.base import Feature
from features.critique.controller import Critiques
from features.critique.details import CritiqueDetails
from features.critique.handlers import GatherFindings
from features.journal import Journal

__all__ = ["Critiques"]


class CritiqueFeature(Feature):
    details = CritiqueDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(GatherFindings())
