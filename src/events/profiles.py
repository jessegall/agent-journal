"""The moments of the profile resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class ProfileCreated(ResourceEvent):
    on: ClassVar[str] = "profile.created"


@dataclass(frozen=True)
class ProfileUpdated(ResourceEvent):
    on: ClassVar[str] = "profile.updated"


@dataclass(frozen=True)
class ProfileCompleted(ResourceEvent):
    on: ClassVar[str] = "profile.completed"
