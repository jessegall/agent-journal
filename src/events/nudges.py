"""The moments of the nudge resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class NudgeCreated(ResourceEvent):
    on: ClassVar[str] = "nudge.created"


@dataclass(frozen=True)
class NudgeUpdated(ResourceEvent):
    on: ClassVar[str] = "nudge.updated"


@dataclass(frozen=True)
class NudgeCompleted(ResourceEvent):
    on: ClassVar[str] = "nudge.completed"


@dataclass(frozen=True, kw_only=True)
class NudgeAsksToAct(Fact):
    """A nudge was said that stands until the agent acts on what it asks."""

    nudge: int


@dataclass(frozen=True, kw_only=True)
class StandingNudgeGone(Fact):
    """A nudge was closed or deleted, so it no longer stands."""

    nudge: int


@dataclass(frozen=True, kw_only=True)
class StandingNudgeAnswered(Fact):
    """A row changed in the way a standing nudge waits for."""

    type: str
    n: int
    action: str


@dataclass(frozen=True, kw_only=True)
class StandingNudgesLost(Fact):
    """Standing nudges that were said to a session that is no longer the agent's, or whose subject is gone, and those that stay."""

    elsewhere: tuple[int, ...]
    gone: tuple[int, ...]
    kept: tuple[int, ...]


@dataclass(frozen=True, kw_only=True)
class NudgeDueAgain(Fact):
    """A standing nudge the agent has not acted on for the repeat time, to be said again."""

    nudge: int
