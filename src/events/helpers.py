"""The moments of the helper resource type."""

from dataclasses import dataclass
from enum import StrEnum
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


class Telling(StrEnum):
    """How a helper was given more work: continued when its agent had stopped and was started again, briefed when it was already working."""

    CONTINUED = "continued"
    BRIEFED = "briefed"

    def mark(self, n: int) -> str:
        return f"{self.capitalize()} helper {n}"


@dataclass(frozen=True)
class HelperCreated(ResourceEvent):
    on: ClassVar[str] = "helper.created"


@dataclass(frozen=True)
class HelperUpdated(ResourceEvent):
    on: ClassVar[str] = "helper.updated"


@dataclass(frozen=True)
class HelperCompleted(ResourceEvent):
    on: ClassVar[str] = "helper.completed"


@dataclass(frozen=True)
class HelperTold(ResourceEvent):
    """A helper was given more work; which of the two it was is the event's own action, and its row says what it was told."""


@dataclass(frozen=True)
class HelperContinued(HelperTold):
    on: ClassVar[str] = f"helper.{Telling.CONTINUED}"


@dataclass(frozen=True)
class HelperBriefed(HelperTold):
    on: ClassVar[str] = f"helper.{Telling.BRIEFED}"


@dataclass(frozen=True, kw_only=True)
class HelperTurnFailed(Fact):
    """The helper's own turn ended in an error, which its dispatcher is told once."""

    failure: str


@dataclass(frozen=True, kw_only=True)
class HelperRefused(Fact):
    """The helper's provider refused to run it."""

    n: int
    name: str
    provider: str
    reason: str
    ref: str


@dataclass(frozen=True, kw_only=True)
class HelperStopped(Fact):
    """The helper's agent is no longer running, with the last words of its launch."""

    n: int
    name: str
    why_it_stopped: str
    ref: str


@dataclass(frozen=True, kw_only=True)
class HelperQuiet(Fact):
    """The helper's agent has said nothing for this many minutes."""

    n: int
    name: str
    minutes: int


@dataclass(frozen=True, kw_only=True)
class HelperIdle(Fact):
    """The helper's agent has stood idle for this many minutes."""

    n: int
    name: str
    minutes: int


@dataclass(frozen=True, kw_only=True)
class AnswerToRelay(Fact):
    """A message a helper's agent wrote while it works a follow-up, which reaches the dispatcher."""

    message: int


@dataclass(frozen=True, kw_only=True)
class HelperAsks(Fact):
    """A helper's agent put a question, which its dispatcher answers in its own environment."""

    environment: str
    who: str
    question: int
    text: str
    options: str
    command: str
    ref: str


@dataclass(frozen=True, kw_only=True)
class SubagentAsks(Fact):
    """A subagent put a question to the agent that dispatched it."""

    who: str
    question: int
    text: str
    options: str
    command: str
    ref: str


@dataclass(frozen=True, kw_only=True)
class SubagentTouched(Fact):
    """A subagent's call touched files of the project that its row does not list yet."""

    agent: int
    files: tuple[str, ...]
