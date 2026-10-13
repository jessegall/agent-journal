"""The moments of the dump resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
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


@dataclass(frozen=True, kw_only=True)
class DumpArrived(Fact):
    """A dump waits to be read, with this many items still without an insight."""

    n: int
    items: str


@dataclass(frozen=True, kw_only=True)
class DumpChoiceMade(Fact):
    """The user picked one of the ways to file a dump."""

    n: int
    label: str


@dataclass(frozen=True, kw_only=True)
class DumpChoiceOpen(Fact):
    """The user left the choice of how to file a dump to the agent."""

    n: int


@dataclass(frozen=True, kw_only=True)
class DumpQuestionAnswered(Fact):
    """The user answered the agent's question about a dump."""

    n: int
    answer: str
    question: str


@dataclass(frozen=True, kw_only=True)
class DumpFiledAway(Fact):
    """The dump was filed and closed, with this outcome."""

    n: int
    outcome: str


@dataclass(frozen=True, kw_only=True)
class DumpFilingStalled(Fact):
    """The agent went idle with items of the dump still to settle."""

    n: int
    items: str


@dataclass(frozen=True, kw_only=True)
class TranscriptPasted(Fact):
    """A message declared a transcript and has no dump yet, by whoever declared it."""

    message: int
    actor: str
