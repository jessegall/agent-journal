from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class CommandMoved(AgentEvent):
    """A command of the agent's ran past its limit and goes on in the background, by its output's number."""

    answers_hook: ClassVar[bool] = False

    output: int
