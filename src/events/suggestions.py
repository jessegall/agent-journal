"""The moments of the suggestion resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
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


@dataclass(frozen=True)
class SuggestionReopened(ResourceEvent):
    on: ClassVar[str] = "suggestion.reopened"


@dataclass(frozen=True, kw_only=True)
class SuggestionToFile(Fact):
    """A suggestion was accepted or adjusted, so it becomes a to-do; `actor` is who decided."""

    n: int
    actor: str


@dataclass(frozen=True, kw_only=True)
class SuggestionFiled(Fact):
    """A to-do was filed from a suggestion."""

    n: int
    todo: int
    actor: str


@dataclass(frozen=True, kw_only=True)
class UserAnswered(Fact):
    """The user answered a suggestion, which shows on their side of the agent's chat; `detail` says what it added."""

    n: int
    label: str
    detail: str


@dataclass(frozen=True, kw_only=True)
class AnswerTakenBack(Fact):
    """The user took their answer to a suggestion back, so its mark leaves the chat."""

    n: int
