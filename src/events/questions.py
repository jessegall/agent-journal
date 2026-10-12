"""The moments of the question resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class QuestionCreated(ResourceEvent):
    on: ClassVar[str] = "question.created"


@dataclass(frozen=True)
class QuestionUpdated(ResourceEvent):
    on: ClassVar[str] = "question.updated"


@dataclass(frozen=True)
class QuestionCompleted(ResourceEvent):
    on: ClassVar[str] = "question.completed"
