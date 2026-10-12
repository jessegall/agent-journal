"""The moments of the critique resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class CritiqueCreated(ResourceEvent):
    on: ClassVar[str] = "critique.created"


@dataclass(frozen=True)
class CritiqueUpdated(ResourceEvent):
    on: ClassVar[str] = "critique.updated"


@dataclass(frozen=True)
class CritiqueCompleted(ResourceEvent):
    on: ClassVar[str] = "critique.completed"
