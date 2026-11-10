from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


@dataclass(frozen=True)
class MergeFinishedTasks(Command[MergeOutcome]):
    """Takes a worker's finished work up to one task or commit into the environment's branch."""

    lock = False

    worker_id: int
    target: str
