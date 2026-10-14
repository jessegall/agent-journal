from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.permission import Permission
from journal.engine.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Idle(AgentState):
    """Nothing declared: the agent may read and run, not write. Where every session starts."""

    name = "idle"
    allows = frozenset({Permission.RUN_COMMANDS})

    def tool_starting(self, event: ToolStarting) -> Transition:
        """A write with no work declared is refused and told how to declare it."""
        from journal.features.tasks.feature import Tasks
        return self.refuse(Tasks.DECLARE.about()) if event.writes else self.stay()
