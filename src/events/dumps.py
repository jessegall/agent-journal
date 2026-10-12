"""The moments of the dump resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent
from resources.base import COMPLETED, USER


@dataclass(frozen=True)
class DumpCreated(ResourceEvent):
    on: ClassVar[str] = "dump.created"


@dataclass(frozen=True)
class DumpUpdated(ResourceEvent):
    on: ClassVar[str] = "dump.updated"


@dataclass(frozen=True)
class DumpCompleted(ResourceEvent):
    on: ClassVar[str] = "dump.completed"


@dataclass(frozen=True)
class DumpWritten(ResourceEvent):
    on: ClassVar[str] = "dump"

    def wanted(self) -> bool:
        return self.action == COMPLETED or (self.written and self.actor == USER)
