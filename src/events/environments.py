"""The moments of the environment resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class EnvironmentCreated(ResourceEvent):
    on: ClassVar[str] = "environment.created"


@dataclass(frozen=True)
class EnvironmentUpdated(ResourceEvent):
    on: ClassVar[str] = "environment.updated"


@dataclass(frozen=True)
class EnvironmentCompleted(ResourceEvent):
    on: ClassVar[str] = "environment.completed"
