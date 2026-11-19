from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CheckWorkerFiles(Command[str]):
    """Sets the files a worker changed beside the files its last judge refusal named. It only reads, so its git
    runs with no write turn held."""

    lock = False
    worker_id: int
