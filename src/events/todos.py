"""The moments of the todo resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class TodoCreated(ResourceEvent):
    on: ClassVar[str] = "todo.created"


@dataclass(frozen=True)
class TodoUpdated(ResourceEvent):
    on: ClassVar[str] = "todo.updated"


@dataclass(frozen=True)
class TodoCompleted(ResourceEvent):
    on: ClassVar[str] = "todo.completed"
