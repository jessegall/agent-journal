from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


@dataclass(frozen=True)
class MergeWorker(Command[MergeOutcome]):
    """Takes a worker's checked work into the environment's branch, or sends it back to the worker on a clash."""

    worker_id: int
