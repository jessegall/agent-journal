from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


@dataclass(frozen=True)
class MergeNextWorker(Command[MergeOutcome]):
    """The merger takes a worker's work into the branch and tells the main agent."""

    worker_id: int
