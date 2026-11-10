from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SendMergerAdvice(Command[str]):
    """The merger advises a worker, within what it may still say to that worker in this group."""

    worker_id: int
    text: str
