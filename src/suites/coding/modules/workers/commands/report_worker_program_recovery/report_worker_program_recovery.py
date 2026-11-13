from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.nudge import Nudge
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class ReportWorkerProgramRecovery(Command[None]):
    """Notifies a parent that a worker resumed after a program outage, with the notice it sends."""

    worker_id: int
    stopped_at: Timestamp
    notice: Nudge

    @property
    def waiting_source(self) -> str:
        return ReportWorkerProgramRecovery.source_of(self.worker_id, self.stopped_at)

    @staticmethod
    def source_of(worker_id: int, stopped_at: Timestamp) -> str:
        return f"workers.program-out:{worker_id}:{stopped_at.text}"
