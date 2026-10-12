"""The moments of the work resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class WorkCreated(ResourceEvent):
    on: ClassVar[str] = "work.created"


@dataclass(frozen=True)
class WorkUpdated(ResourceEvent):
    on: ClassVar[str] = "work.updated"


@dataclass(frozen=True)
class WorkCompleted(ResourceEvent):
    on: ClassVar[str] = "work.completed"
