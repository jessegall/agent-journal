from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent
from journal.support.tool_input import ToolInput


@dataclass(frozen=True)
class ToolStarting(AgentEvent):
    """The agent is about to run a tool; the one moment a blocking listener can refuse."""

    tool: str
    input: dict
    writes: bool = False
    written_paths: tuple[str, ...] = ()
    read_paths: tuple[str, ...] = ()
    file_lines: int = 0

    @property
    def words(self) -> str:
        return ToolInput.from_json(self.input).command if self.tool == "Bash" else ""

    @property
    def input_text(self) -> str:
        return " ".join(str(value) for value in self.input.values())
