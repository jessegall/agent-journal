from features.base import Feature
from features.journal import Journal
from features.sequences.controller import Sequences
from features.sequences.details import SequencesDetails
from features.sequences.handlers import EndWithItsRow, HandStepToAgent, StartOnMoment

__all__ = ["Sequences"]


class SequencesFeature(Feature):
    details = SequencesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(StartOnMoment())
        journal.events.handler(EndWithItsRow())
        journal.events.handler(HandStepToAgent())
