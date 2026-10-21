from dataclasses import dataclass, field
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class LineDelivered(AgentEvent):
    """The journal said the agent a line, by the key of the nudge that said it, so a listener may count or note what was said without saying a line of its own, or it would say itself again."""

    answers_hook: ClassVar[bool] = False

    nudge: str
    values: dict = field(default_factory=dict)
