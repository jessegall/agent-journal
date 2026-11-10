from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class StartNextWorkerTask(Command[Task]):
    """A worker is done with its current task and has another in its queue: the task is committed and moved
    to testing, and the next starts once its proofs' tests pass; the worktree is handed in only after the
    last."""

    differences: str
