from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Orienting(Paused):
    """The session started, came back from a compaction or took the environment over: what is in flight here must be read before any other write. journal environment here takes the agent back."""

    name = "orienting"

    def awaiting(self) -> tuple[str, str]:
        return "a look at what is in flight here", ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.briefing.feature import Briefing
        return self.refuse(Briefing.ORIENT.about()) if event.writes else self.stay()
