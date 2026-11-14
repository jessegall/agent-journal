from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.support.tasks_changed_together import TasksChangedTogether
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class RecordWorktreeTakeover(Command[Worktree], TasksChangedTogether):
    """Gives a stopped worker's open worktree to a new worker, with the tasks and the plan the stopped worker held,
    so the new worker goes on where the stopped one left off: its commits, proofs and files stay as they were."""

    worktree_id: int
    worker_id: int
