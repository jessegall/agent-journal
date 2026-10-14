from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Idle(AgentState):
    """Nothing declared: the agent may read and run, not write. Where every session starts."""

    name = "idle"

    def session_started(self, event: SessionStarted) -> Transition: ...

    def tool_starting(self, event: ToolStarting) -> Transition:
        """A write with no work declared is refused and told how to declare it."""
        ...
