"""The moments of the work resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent
from resources.types import Work


@dataclass(frozen=True)
class WorkCreated(ResourceEvent):
    on: ClassVar[str] = "work.created"


@dataclass(frozen=True)
class WorkUpdated(ResourceEvent):
    on: ClassVar[str] = "work.updated"


@dataclass(frozen=True)
class WorkCompleted(ResourceEvent):
    on: ClassVar[str] = "work.completed"
    todo: bool = False

    @classmethod
    def read(cls, event) -> "WorkCompleted":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor, todo=bool(event.data.get(Work.todo)))
