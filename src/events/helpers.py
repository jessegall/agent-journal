"""The moments of the helper resource type."""

from dataclasses import dataclass
from enum import StrEnum
from typing import ClassVar

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
