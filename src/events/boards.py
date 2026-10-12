"""The moments of the board resource type."""

from dataclasses import dataclass, field
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class BoardCreated(ResourceEvent):
    on: ClassVar[str] = "board.created"


@dataclass(frozen=True)
class BoardUpdated(ResourceEvent):
    on: ClassVar[str] = "board.updated"


@dataclass(frozen=True)
class BoardCompleted(ResourceEvent):
    on: ClassVar[str] = "board.completed"


@dataclass(frozen=True)
class BoardCommissioned(ResourceEvent):
    on: ClassVar[str] = "board.commissioned"


@dataclass(frozen=True)
class BoardStarted(ResourceEvent):
    on: ClassVar[str] = "board.started"


@dataclass(frozen=True)
class BoardPaused(ResourceEvent):
    on: ClassVar[str] = "board.paused"


@dataclass(frozen=True)
class BoardResumed(ResourceEvent):
    on: ClassVar[str] = "board.resumed"


@dataclass(frozen=True)
class BoardFinished(ResourceEvent):
    on: ClassVar[str] = "board.finished"


@dataclass(frozen=True)
class BoardOrchestrated(ResourceEvent):
    on: ClassVar[str] = "board.orchestrated"
    orchestrating: bool = False


@dataclass(frozen=True)
class BoardChanged(ResourceEvent):
    on: ClassVar[str] = "board"
    fields: list = field(default_factory=list)
