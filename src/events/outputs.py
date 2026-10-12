"""The moments of the output resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class OutputCreated(ResourceEvent):
    on: ClassVar[str] = "output.created"


@dataclass(frozen=True)
class OutputUpdated(ResourceEvent):
    on: ClassVar[str] = "output.updated"


@dataclass(frozen=True)
class OutputCompleted(ResourceEvent):
    on: ClassVar[str] = "output.completed"
