"""The moments of the helper resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class HelperCreated(ResourceEvent):
    on: ClassVar[str] = "helper.created"


@dataclass(frozen=True)
class HelperUpdated(ResourceEvent):
    on: ClassVar[str] = "helper.updated"


@dataclass(frozen=True)
class HelperCompleted(ResourceEvent):
    on: ClassVar[str] = "helper.completed"
