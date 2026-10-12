"""The moments of the worktree resource type."""

from dataclasses import dataclass
from typing import ClassVar

from events.resources import ResourceEvent


@dataclass(frozen=True)
class WorktreeCreated(ResourceEvent):
    on: ClassVar[str] = "worktree.created"


@dataclass(frozen=True)
class WorktreeUpdated(ResourceEvent):
    on: ClassVar[str] = "worktree.updated"


@dataclass(frozen=True)
class WorktreeCompleted(ResourceEvent):
    on: ClassVar[str] = "worktree.completed"
