from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent
from journal.support.tool_input import ToolInput


@dataclass(frozen=True)
class ToolStarting(AgentEvent):
    """The agent is about to run a tool; the one moment a blocking listener can refuse."""

    tool: str
    input: dict
    writes: bool = False
    """Whether this tool changes a file, as the agent's provider says."""

    @property
    def words(self) -> str:
        """The shell line the agent is about to run; no words for any other tool."""
        return ToolInput.from_json(self.input).command if self.tool == "Bash" else ""

    @property
    def input_text(self) -> str:
        """Every value of the call's input, as one line of words."""
        return " ".join(str(value) for value in self.input.values())
