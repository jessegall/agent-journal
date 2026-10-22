from dataclasses import dataclass

from journal.models.task import Task


@dataclass(frozen=True)
class MergeOutcome:
    """What a worker's merge came to: its task, closed, and what became of its worktree."""

    task: Task
    worktree: str
