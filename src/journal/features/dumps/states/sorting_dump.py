from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle
from journal.events.agent.prompt_submitted import PromptSubmitted


@dataclass(frozen=True)
class SortingDump(Paused):
    """The agent files the dump the user dropped: the stop is held until every item is filed or failed, save while it waits on the user's answer, and only the dump's own commands end it."""

    name = "sorting_dump"
    title = "Sorting a dump"
    leaves_by_itself = True
    dump_id: int = 0
    asking: bool = False

    def awaiting(self) -> tuple[str, str]:
        return (f"your answer on dump {self.dump_id}", f"dump:{self.dump_id}") if self.asking else ("", "")

    def idle(self, event: Idle) -> Transition:
        from journal.features.dumps.feature import DumpsFeature
        return self.stay() if self.asking else self.refuse(DumpsFeature.STILL_OPEN.about(n=self.dump_id))

    def prompt_submitted(self, event: PromptSubmitted) -> Transition:
        return self.stay()
