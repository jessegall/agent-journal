from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Idle(AgentState):
    """Nothing declared: the agent may read and run, not write. Where every session starts."""

    name = "idle"
    title = "Idle"
    allows = frozenset({Permission.RUN_COMMANDS})

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.stay()
