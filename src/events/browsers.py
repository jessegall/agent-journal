"""The moments of the browser resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class BrowserCreated(ResourceEvent):
    on: ClassVar[str] = "browser.created"


@dataclass(frozen=True)
class BrowserUpdated(ResourceEvent):
    on: ClassVar[str] = "browser.updated"


@dataclass(frozen=True)
class BrowserCompleted(ResourceEvent):
    on: ClassVar[str] = "browser.completed"
