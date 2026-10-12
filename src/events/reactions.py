"""The moments of the reaction resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class ReactionCreated(ResourceEvent):
    on: ClassVar[str] = "reaction.created"


@dataclass(frozen=True)
class ReactionUpdated(ResourceEvent):
    on: ClassVar[str] = "reaction.updated"


@dataclass(frozen=True)
class ReactionCompleted(ResourceEvent):
    on: ClassVar[str] = "reaction.completed"
