"""The moments of the reminder resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
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


@dataclass(frozen=True, kw_only=True)
class ReminderMentioned(Fact):
    """A word the reminder is keyed to came up in what the agent did or wrote, so it is whispered to it."""

    agent: int
    n: int
    title: str


@dataclass(frozen=True, kw_only=True)
class RemindersStanding(Fact):
    """The standing reminders that bind the agent, to be read again as it works."""

    agent: int
    count: str
    rows: str
