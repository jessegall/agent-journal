"""The moments of the notice resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class NoticeCreated(ResourceEvent):
    on: ClassVar[str] = "notice.created"


@dataclass(frozen=True)
class NoticeUpdated(ResourceEvent):
    on: ClassVar[str] = "notice.updated"


@dataclass(frozen=True)
class NoticeCompleted(ResourceEvent):
    on: ClassVar[str] = "notice.completed"
