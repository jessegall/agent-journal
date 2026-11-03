from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordWorkerLaunchFailure(Command[None]):
    worker_id: int
