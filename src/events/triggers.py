"""The moments of the trigger resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent
from resources.base import FIRED


@dataclass(frozen=True)
class TriggerCreated(ResourceEvent):
    on: ClassVar[str] = "trigger.created"


@dataclass(frozen=True)
class TriggerUpdated(ResourceEvent):
    on: ClassVar[str] = "trigger.updated"


@dataclass(frozen=True)
class TriggerCompleted(ResourceEvent):
    on: ClassVar[str] = "trigger.completed"


@dataclass(frozen=True)
class TriggerFired(ResourceEvent):
    on: ClassVar[str] = f"trigger.{FIRED}"
    about: str = ""
