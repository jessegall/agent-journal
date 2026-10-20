from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class LineSaid(AgentEvent):
    """The journal said the agent a line, by the key of the nudge that said it; a workflow started by it counts or notes and says nothing, or it would start itself again."""

    answers_hook: ClassVar[bool] = False

    nudge: str
