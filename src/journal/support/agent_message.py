from dataclasses import dataclass

from journal.support.operation import Operation


@dataclass(frozen=True)
class AgentMessage(Operation):
    """A message the agent sends another agent or one of its subagents with its program's own tool."""

    kind = "agent message"
    receiver: str
    text: str
