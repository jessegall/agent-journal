from dataclasses import dataclass, replace

from journal.events.agent.agent_event import AgentEvent
from journal.support.tool_call import ToolCall


@dataclass(frozen=True)
class ToolStarting(AgentEvent):
    """The agent is about to run a tool; the one moment a blocking listener can refuse. The call is read once and carried whole, with how many times the agent has run its command's shape, this run included, counted once as the hook is taken in."""

    is_work = True

    call: ToolCall
    shape_runs: int = 0

    def shape_counted(self, runs: int) -> "ToolStarting":
        return replace(self, shape_runs=runs)

    @property
    def content(self) -> str:
        return self.call.command

    def recorded(self) -> dict:
        return {"call": self.call.as_data()}
