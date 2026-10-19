from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class PausedByUser(Paused):
    """The user paused the agent from the viewer: every tool call is held until the user resumes it, by the resume button or by writing to it."""

    name = "paused"
    title = "Paused by you"

    def awaiting(self) -> tuple[str, str]:
        return "you to resume it", ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.pausing.feature import PausingFeature
        return self.refuse(PausingFeature.PAUSED.about())
