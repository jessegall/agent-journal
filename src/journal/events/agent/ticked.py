from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class Ticked(AgentEvent):
    """The clock, every few seconds, for each live agent: the moment for anything that happens on time rather than on a hook."""

    answers_hook: ClassVar[bool] = False

    quiet_for: float
