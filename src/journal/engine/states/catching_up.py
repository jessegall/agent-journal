from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class CatchingUp(Paused):
    """After a session start or a compaction: writes are held until the agent has read its briefing, then it goes back."""

    name = "catching_up"

    def tool_starting(self, event: ToolStarting) -> Transition: ...

    def tool_finished(self, event: ToolFinished) -> Transition:
        """Reading the briefing is what ends the hold."""
        ...
