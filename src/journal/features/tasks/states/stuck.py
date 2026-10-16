from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Stuck(Paused):
    """The agent said it is truly stuck. Nothing is said until its next tool use or prompt, which take it back."""

    name = "stuck"
    why: str = ""

    def awaiting(self) -> tuple[str, str]:
        return self.why, ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        return self.stay() if event.subagent else self.back()

