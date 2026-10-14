"""The moments of the notification resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class NotificationCreated(ResourceEvent):
    on: ClassVar[str] = "notification.created"


@dataclass(frozen=True)
class NotificationUpdated(ResourceEvent):
    on: ClassVar[str] = "notification.updated"


@dataclass(frozen=True)
class NotificationCompleted(ResourceEvent):
    on: ClassVar[str] = "notification.completed"
