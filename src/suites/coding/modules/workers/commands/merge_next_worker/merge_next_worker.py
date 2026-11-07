from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


@dataclass(frozen=True)
class MergeNextWorker(Command[MergeOutcome]):
    """The merger takes a worker's work into the branch, answering its important lines if it has any."""

    worker_id: int
    read_important: str = ""
