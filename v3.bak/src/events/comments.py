"""The moments of the comment resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class CommentCreated(ResourceEvent):
    on: ClassVar[str] = "comment.created"


@dataclass(frozen=True)
class CommentUpdated(ResourceEvent):
    on: ClassVar[str] = "comment.updated"


@dataclass(frozen=True)
class CommentCompleted(ResourceEvent):
    on: ClassVar[str] = "comment.completed"
