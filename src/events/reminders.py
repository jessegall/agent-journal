"""The moments of the reminder resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class ReminderCreated(ResourceEvent):
    on: ClassVar[str] = "reminder.created"


@dataclass(frozen=True)
class ReminderUpdated(ResourceEvent):
    on: ClassVar[str] = "reminder.updated"


@dataclass(frozen=True)
class ReminderCompleted(ResourceEvent):
    on: ClassVar[str] = "reminder.completed"
