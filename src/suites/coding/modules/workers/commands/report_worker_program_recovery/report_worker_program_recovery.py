from dataclasses import dataclass

from engine.command.command import Command
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class ReportWorkerProgramRecovery(Command[None]):
    """Notifies a parent that a worker resumed after a program outage."""

    worker_id: int
    stopped_at: Timestamp

    @property
    def waiting_source(self) -> str:
        return f"workers.program-out:{self.worker_id}:{self.stopped_at.text}"
