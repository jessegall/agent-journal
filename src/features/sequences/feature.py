from features.base import Feature
from features.journal import Journal
from features.sending import Nudge
from features.sequences.controller import Sequences
from features.sequences.details import SequencesDetails
from features.triggers.controller import STARTED_BY
from features.sequences.details import UNFINISHED
from features.sequences.shipped import SEQUENCES
from features.sequences.handlers import (DispatchAgainOnAnswer, EndWithItsRow, HandStepToAgent, HoldAStalledStep, HoldJournalWritesForTheStep, KeepOutOfTheChat,
                                         ReleaseStaleStep, ResetEditsOnStep, StartOnMoment, StartOnTrigger, standing_steps, step_pace)

__all__ = ["Sequences"]


class SequencesFeature(Feature):
    details = SequencesDetails
    nudges = (Nudge(UNFINISHED, behaviour=UNFINISHED, about=standing_steps, private=False, pace=step_pace,
                    guarantee="While a sequence stands at a step, the agent is told which step it is on until it moves on or gives the sequence up."),)
    sequences = SEQUENCES

    def register(self, journal: Journal) -> None:
        STARTED_BY.add(None, Sequences)
        journal.events.handler(StartOnMoment())
        journal.events.handler(StartOnTrigger())
        journal.events.handler(DispatchAgainOnAnswer())
        journal.agent.interceptor(HoldJournalWritesForTheStep())
        journal.events.handler(EndWithItsRow())
        journal.events.handler(HandStepToAgent())
        journal.events.handler(HoldAStalledStep())
        journal.events.handler(ResetEditsOnStep())
        journal.events.handler(ReleaseStaleStep())
        journal.events.handler(KeepOutOfTheChat())
