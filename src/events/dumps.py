"""The moments of the dump resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class DumpCreated(ResourceEvent):
    on: ClassVar[str] = "dump.created"


@dataclass(frozen=True)
class DumpUpdated(ResourceEvent):
    on: ClassVar[str] = "dump.updated"


@dataclass(frozen=True)
class DumpCompleted(ResourceEvent):
    on: ClassVar[str] = "dump.completed"
