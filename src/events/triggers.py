"""The moments of the trigger resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class TriggerCreated(ResourceEvent):
    on: ClassVar[str] = "trigger.created"


@dataclass(frozen=True)
class TriggerUpdated(ResourceEvent):
    on: ClassVar[str] = "trigger.updated"


@dataclass(frozen=True)
class TriggerCompleted(ResourceEvent):
    on: ClassVar[str] = "trigger.completed"
