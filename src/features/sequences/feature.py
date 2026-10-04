from features.base import Feature
from features.journal import Journal
from features.nudges import Nudge
from features.sequences.controller import Sequences
from features.sequences.details import SequencesDetails
from features.sequences.details import UNFINISHED
from features.sequences.handlers import (DispatchAgainOnAnswer, EndWithItsRow, HandStepToAgent, HoldJournalWritesForTheStep, KeepOutOfTheChat,
                                         StartOnMoment, StartOnTrigger, standing_steps, step_pace)

__all__ = ["Sequences"]


class SequencesFeature(Feature):
    details = SequencesDetails
    nudges = (Nudge(UNFINISHED, behaviour=UNFINISHED, about=standing_steps, private=False, pace=step_pace),)

    def register(self, journal: Journal) -> None:
        journal.events.handler(StartOnMoment())
        journal.events.handler(StartOnTrigger())
        journal.events.handler(DispatchAgainOnAnswer())
        journal.agent.interceptor(HoldJournalWritesForTheStep())
        journal.events.handler(EndWithItsRow())
        journal.events.handler(HandStepToAgent())
        journal.events.handler(KeepOutOfTheChat())
