from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class CheckWorkerFiles(Command[str]):
    """Sets the files a worker changed beside the files its last judge refusal named."""

    worker_id: int
