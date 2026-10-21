from dataclasses import dataclass, field

from journal.events.agent.agent_event import AgentEvent
from journal.support.tool_call import ToolCall


@dataclass(frozen=True)
class ToolFinished(AgentEvent):
    """A tool ran and returned: the same reading of the call as when it started, with what it printed and its answer as it came, a shell's output in parts or an edit's patch."""

    call: ToolCall
    output: str
    response: dict = field(default_factory=dict)

    @property
    def printed(self) -> str:
        """What the shell line printed; nothing for any other tool, whose answer may carry a whole file."""
        return self.output if self.call.tool == "Bash" else ""

    def recorded(self) -> dict:
        return {"call": self.call.as_data()}
