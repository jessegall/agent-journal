from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class DeliverTask(Command[Task]):
    """A worker says all its tasks are done: its worktree is committed and they wait for their proofs to be
    checked."""

    differences: str
