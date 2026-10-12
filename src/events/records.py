"""The moments of the record resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class RecordCreated(ResourceEvent):
    on: ClassVar[str] = "record.created"


@dataclass(frozen=True)
class RecordUpdated(ResourceEvent):
    on: ClassVar[str] = "record.updated"


@dataclass(frozen=True)
class RecordCompleted(ResourceEvent):
    on: ClassVar[str] = "record.completed"
