from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class LeaveWorkerBehind(Command[None]):
    """The merger or the main agent leaves a worker behind its base alone, saying why it does not matter."""

    worker_id: int
    why: str
