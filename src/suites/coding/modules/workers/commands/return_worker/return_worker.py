from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReturnWorker(Command[None]):
    """The merger leaves a worker to the main agent, with the reason."""

    worker_id: int
    reason: str
