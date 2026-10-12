"""The moments of the fact resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class FactCreated(ResourceEvent):
    on: ClassVar[str] = "fact.created"


@dataclass(frozen=True)
class FactUpdated(ResourceEvent):
    on: ClassVar[str] = "fact.updated"


@dataclass(frozen=True)
class FactCompleted(ResourceEvent):
    on: ClassVar[str] = "fact.completed"
