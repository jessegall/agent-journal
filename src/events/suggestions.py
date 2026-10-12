"""The moments of the suggestion resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class SuggestionCreated(ResourceEvent):
    on: ClassVar[str] = "suggestion.created"


@dataclass(frozen=True)
class SuggestionUpdated(ResourceEvent):
    on: ClassVar[str] = "suggestion.updated"


@dataclass(frozen=True)
class SuggestionCompleted(ResourceEvent):
    on: ClassVar[str] = "suggestion.completed"
