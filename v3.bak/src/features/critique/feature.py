from controllers.types import Critiques
from expects import Given, Refused
from features.critique.commands import Round
from features.critique.details import CritiqueDetails
from framework.base import Feature
from framework.journal import Journal

__all__ = ["Critiques"]


class CritiqueFeature(Feature):
    details = CritiqueDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("critique", Round(), expects=[
            Given((Critiques, "the helper list")) >> Refused('name the app the critics open first: journal settings, critique.app "<address>"'),
        ])
