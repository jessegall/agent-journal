from features.base import Feature
from features.journal import Journal
from features.nudges import Nudge
from features.sequences.controller import Sequences
from features.sequences.details import SequencesDetails
from features.sequences.handlers import (DispatchAgainOnAnswer, EndWithItsRow, HandStepToAgent, HoldJournalWritesForTheStep, KeepOutOfTheChat,
                                         NudgeWaitingStep, StartOnMoment, StartOnTrigger, UNFINISHED, pace,
                                         unfinished_steps)

__all__ = ["Sequences"]


class SequencesFeature(Feature):
    details = SequencesDetails
    nudges = (Nudge(UNFINISHED, every=pace, about=unfinished_steps, private=False),)

    def register(self, journal: Journal) -> None:
        journal.events.handler(StartOnMoment())
        journal.events.handler(StartOnTrigger())
        journal.events.handler(DispatchAgainOnAnswer())
        journal.agent.interceptor(HoldJournalWritesForTheStep())
        journal.events.handler(EndWithItsRow())
        journal.events.handler(HandStepToAgent())
        journal.events.handler(KeepOutOfTheChat())
        journal.events.handler(NudgeWaitingStep())
