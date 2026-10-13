"""The moments of the fact resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class FactCreated(ResourceEvent):
    on: ClassVar[str] = "fact.created"


@dataclass(frozen=True)
class FactUpdated(ResourceEvent):
    on: ClassVar[str] = "fact.updated"


@dataclass(frozen=True)
class FactCompleted(ResourceEvent):
    on: ClassVar[str] = "fact.completed"


@dataclass(frozen=True, kw_only=True)
class FactMentioned(Fact):
    """A word the fact is keyed to came up in what the agent did or wrote, so it is whispered to it."""

    agent: int
    n: int
    title: str


@dataclass(frozen=True, kw_only=True)
class FactsStanding(Fact):
    """The standing facts that bind the agent, to be read again as it works."""

    agent: int
    count: str
    rows: str
