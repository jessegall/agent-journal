from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordWorkerLaunchFailure(Command[None]):
    """Records that a worker's program could not start."""

    worker_id: int
