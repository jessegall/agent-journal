from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ReportMergeHook(Command[None]):
    """Tells the main agent that a merge hook of a worker's profile failed after its merge, which stands."""

    worker_id: int
    command: str
    reason: str
