"""The moments of the collection resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class CollectionCreated(ResourceEvent):
    on: ClassVar[str] = "collection.created"


@dataclass(frozen=True)
class CollectionUpdated(ResourceEvent):
    on: ClassVar[str] = "collection.updated"


@dataclass(frozen=True)
class CollectionCompleted(ResourceEvent):
    on: ClassVar[str] = "collection.completed"
