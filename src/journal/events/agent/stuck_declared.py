from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class StuckDeclared(AgentEvent):
    """The agent said with journal stuck that it is truly stuck, and why."""

    answers_hook: ClassVar[bool] = False

    why: str
