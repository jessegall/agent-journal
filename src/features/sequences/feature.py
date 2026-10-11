from expects import Given, Kept, Refused
from features.base import Feature
from features.sequences.resource import Sequence
from providers.payload import BashCall
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


def release(step: int = 1, **run) -> Sequence:
    return Sequence(n=4, title="Cutting a patch release", sections=[{"title": "Tag it", "body": "Run journal version tag to cut the tag."}],
                    data={"runs": {"t|by hand": {"step": step, "at": 1.0, **run}}})


def shell(command: str) -> BashCall:
    return BashCall.from_payload("Bash", {"command": command}, {})


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
        journal.agent.interceptor(HoldJournalWritesForTheStep(), expects=[
            Given(shell('journal todo create "Later"'), rows=[release()]) >> Refused("sequence 4, Cutting a patch release, handed you step 1 - take it up with journal sequence follow 4 before any other write - then do what the step says and journal sequence next 4"),
            Given(shell('journal todo create "Later"'), rows=[release(followed=1)]) >> Kept(),
            Given(shell('journal todo create "Later"')) >> Kept(),
            Given(shell("journal version tag"), rows=[release()]) >> Kept(),
            Given(shell("journal todo show 3"), rows=[release()]) >> Kept(),
            Given(shell("journal sequence next 4"), rows=[release()]) >> Kept(),
            Given(shell("git status"), rows=[release()]) >> Kept(),
        ])
        journal.events.handler(EndWithItsRow())
        journal.events.handler(HandStepToAgent())
        journal.events.handler(HoldAStalledStep())
        journal.events.handler(ResetEditsOnStep())
        journal.events.handler(ReleaseStaleStep())
        journal.events.handler(KeepOutOfTheChat())
