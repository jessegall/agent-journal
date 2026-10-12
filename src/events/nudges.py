"""The moments of the nudge resource type."""

from dataclasses import dataclass
from typing import ClassVar

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
