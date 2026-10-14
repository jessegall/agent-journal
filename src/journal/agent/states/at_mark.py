from dataclasses import dataclass

from journal.agent.states.paused import Paused
from journal.agent.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class AtMark(Paused):
    """At a mark of the context window: writes are held until the agent records a fact, a rule or nothing, which takes it back."""

    name = "at_mark"
    mark: int = 0

    def tool_starting(self, event: ToolStarting) -> Transition: ...
