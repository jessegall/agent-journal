"""The moments of the tool resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class ToolCreated(ResourceEvent):
    on: ClassVar[str] = "tool.created"


@dataclass(frozen=True)
class ToolUpdated(ResourceEvent):
    on: ClassVar[str] = "tool.updated"


@dataclass(frozen=True)
class ToolCompleted(ResourceEvent):
    on: ClassVar[str] = "tool.completed"
