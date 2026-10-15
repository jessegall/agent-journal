from dataclasses import dataclass

from journal.engine.states.paused import Paused
from journal.engine.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class AtMark(Paused):
    """At a mark of the context window: writes are held until the agent records a fact, a rule or nothing, which takes it back."""

    name = "at_mark"
    owed_by_agent = True
    mark: int = 0

    def awaiting(self) -> tuple[str, str]:
        return f"a decision at the context mark, {self.mark}% full", ""

    def tool_starting(self, event: ToolStarting) -> Transition:
        from journal.features.memory.feature import Memory
        return self.refuse(Memory.HELD.about()) if event.writes else self.stay()
