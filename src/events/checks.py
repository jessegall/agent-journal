"""The moments of the check resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class CheckCreated(ResourceEvent):
    on: ClassVar[str] = "check.created"


@dataclass(frozen=True)
class CheckCompleted(ResourceEvent):
    on: ClassVar[str] = "check.completed"


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False
