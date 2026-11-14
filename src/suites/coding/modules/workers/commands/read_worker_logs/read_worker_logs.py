from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ReadWorkerLogs(Command[str]):
    worker_id: int
    task_id: int | None = None
    process_id: int | None = None
    json_output: bool = False
