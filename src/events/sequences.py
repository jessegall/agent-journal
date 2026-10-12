"""The moments of the sequence resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class SequenceCreated(ResourceEvent):
    on: ClassVar[str] = "sequence.created"


@dataclass(frozen=True)
class SequenceUpdated(ResourceEvent):
    on: ClassVar[str] = "sequence.updated"


@dataclass(frozen=True)
class SequenceCompleted(ResourceEvent):
    on: ClassVar[str] = "sequence.completed"
