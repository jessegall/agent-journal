from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordFailedUpdate(Command[None]):
    """Notes on the worker's open or ordered check that its update failed and changed nothing, and tells the merger."""

    worker_id: int
    reason: str
