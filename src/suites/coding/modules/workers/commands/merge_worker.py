from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.commands.worker_merge import WorkerMerge


@dataclass(frozen=True)
class MergeWorker(Command[WorkerMerge]):
    """Takes a worker's checked work into the environment's branch, or sends it back to the worker on a clash."""

    worker_id: int
