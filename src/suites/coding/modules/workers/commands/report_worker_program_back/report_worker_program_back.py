from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReportWorkerProgramBack(Command[None]):
    """Notifies a parent that a worker resumed after a program outage."""

    worker_id: int
    waiting_source: str
