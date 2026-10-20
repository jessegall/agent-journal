from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class CommandEnded(AgentEvent):
    """A command of the agent's that ran in the background ended, by its output's number and its exit status."""

    answers_hook: ClassVar[bool] = False

    output: int
    status: int
