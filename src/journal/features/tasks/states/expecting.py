from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.idle import Idle as AgentIdle
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_starting import ToolStarting



@dataclass(frozen=True)
class Expecting(Paused):
    """The agent waits for something outside its hands, named in words. Stopping is quiet; working again takes it back; every five quiet minutes it is asked to look."""

    name = "expecting"
    what: str = ""

    def awaiting(self) -> tuple[str, str]:
        return self.what, ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        """The agent's own tool use is working again; a subagent's is not."""
        return self.stay() if event.subagent else self.back()

    def prompt_submitted(self, event: PromptSubmitted) -> Transition:
        return self.back()

    def idle(self, event: AgentIdle) -> Transition:
        return self.stay()


