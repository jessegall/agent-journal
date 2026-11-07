from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordOwnTestFailure(Command[None]):
    """A test a worker ran itself failed on the task in its hands."""

    worker_id: int
    task_id: int
    line: str
