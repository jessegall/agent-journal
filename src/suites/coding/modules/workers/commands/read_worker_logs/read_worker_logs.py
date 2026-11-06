from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReadWorkerLogs(Command[str]):
    worker_id: int
