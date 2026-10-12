"""The moments of the doc resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class DocCreated(ResourceEvent):
    on: ClassVar[str] = "doc.created"


@dataclass(frozen=True)
class DocUpdated(ResourceEvent):
    on: ClassVar[str] = "doc.updated"


@dataclass(frozen=True)
class DocCompleted(ResourceEvent):
    on: ClassVar[str] = "doc.completed"
