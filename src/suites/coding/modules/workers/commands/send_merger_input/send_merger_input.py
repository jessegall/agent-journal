from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendMergerInput(Command[None]):
    """A worker's report goes to the merger."""

    worker_id: int
    text: str
