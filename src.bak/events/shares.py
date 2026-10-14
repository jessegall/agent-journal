"""The moments of the share resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class ShareCreated(ResourceEvent):
    on: ClassVar[str] = "share.created"


@dataclass(frozen=True)
class ShareUpdated(ResourceEvent):
    on: ClassVar[str] = "share.updated"


@dataclass(frozen=True)
class ShareCompleted(ResourceEvent):
    on: ClassVar[str] = "share.completed"
