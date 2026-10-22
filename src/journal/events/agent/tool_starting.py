from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent
from journal.support.tool_call import ToolCall


@dataclass(frozen=True)
class ToolStarting(AgentEvent):
    """The agent is about to run a tool; the one moment a blocking listener can refuse. The call is read once and carried whole."""

    is_work = True

    call: ToolCall

    @property
    def content(self) -> str:
        return self.call.command

    def recorded(self) -> dict:
        return {"call": self.call.as_data()}
