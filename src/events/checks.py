"""The moments of the check resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class CheckCreated(ResourceEvent):
    on: ClassVar[str] = "check.created"


@dataclass(frozen=True)
class CheckCompleted(ResourceEvent):
    on: ClassVar[str] = "check.completed"


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False


@dataclass(frozen=True, kw_only=True)
class CheckDue(Fact):
    """A check whose turn has come to run."""

    check: int


@dataclass(frozen=True, kw_only=True)
class CheckPassedAgain(Fact):
    """A check that was reported failing passes now, so what was filed against it is settled."""

    check: int
    about: str
    notification: int


@dataclass(frozen=True, kw_only=True)
class CheckFailed(Fact):
    """A check ran and failed with something not yet reported; what was filed about it earlier no longer holds."""

    check: int
    about: str
    title: str
    headline: str
    output: str
    reported: str
    stale: tuple[int, ...]


@dataclass(frozen=True, kw_only=True)
class TestsRunning(Fact):
    """A test command the agent started is under way."""

    __test__ = False

    agent: int
    key: str
    name: str
    command: str
    title: str
    started: float
    runs: int = 1


@dataclass(frozen=True, kw_only=True)
class TestsFinished(Fact):
    """A test command the agent started has ended."""

    __test__ = False

    agent: int
    key: str
    label: str
    name: str
    command: str
    title: str
    state: str
    started: float
    ended: float
    detail: str
    runs: int = 1
