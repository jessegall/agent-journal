from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Halted(Paused):
    """The agent said it is truly stuck. Nothing is said until its next tool use or prompt, which take it back."""

    name = "halted"
    why: str = ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        return self.back()

    def prompt_submitted(self, event: PromptSubmitted) -> Transition:
        return self.back()
