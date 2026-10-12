"""The moments of the phone resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class PhoneCreated(ResourceEvent):
    on: ClassVar[str] = "phone.created"


@dataclass(frozen=True)
class PhoneUpdated(ResourceEvent):
    on: ClassVar[str] = "phone.updated"


@dataclass(frozen=True)
class PhoneCompleted(ResourceEvent):
    on: ClassVar[str] = "phone.completed"
