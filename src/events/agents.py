"""The moments of the agent resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent, RowAction
from events.typed import AgentEvent


@dataclass(frozen=True)
class AgentCreated(ResourceEvent):
    on: ClassVar[str] = "agent.created"


@dataclass(frozen=True)
class AgentUpdated(ResourceEvent):
    on: ClassVar[str] = "agent.updated"


@dataclass(frozen=True)
class AgentCompleted(ResourceEvent):
    on: ClassVar[str] = "agent.completed"


@dataclass(frozen=True)
class AgentChanged(AgentEvent, RowAction):
    on: ClassVar[str] = "agent"

    @classmethod
    def read(cls, event) -> "AgentChanged":
        return cls(agent=event.n, action=event.action)
