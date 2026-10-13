"""The moments of the board resource type."""

from dataclasses import dataclass, field
from typing import ClassVar

from events import Fact
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


@dataclass(frozen=True, kw_only=True)
class CardsAddedToBoard(Fact):
    """Cards were added to a board, which the agent is to offer to place."""

    board: int
    title: str
    count: int
    tickets: str
    uncovered: str


@dataclass(frozen=True, kw_only=True)
class BoardFillingQuiet(Fact):
    """A board being drafted has had nothing written to it for this many seconds."""

    board: int
    seconds: int
