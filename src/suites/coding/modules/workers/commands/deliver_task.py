from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.task import Task


@dataclass(frozen=True)
class DeliverTask(Command[Task]):
    """A worker says its task is done: its worktree is committed and the task waits for its proofs to be checked."""
