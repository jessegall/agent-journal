from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.timestamp import Timestamp

WORKER_PROGRAM_UNAVAILABLE = NudgeDeclaration("workers.program_out", NudgeType.STEERING, "worker:{worker} stopped: {program} is out until {availability}, {reason}: wait, or journal worker release {worker}", turn_limited=False, wakes_agent=True)
WORKER_PROGRAM_RESUMED = NudgeDeclaration("workers.program_back", NudgeType.STEERING, "worker:{worker} resumed: {program} is back", turn_limited=False)


@dataclass(frozen=True)
class ReportWorkerProgramRecovery(Command[None]):
    """Notifies a parent that a worker resumed after a program outage."""

    worker_id: int
    stopped_at: Timestamp

    @property
    def waiting_source(self) -> str:
        return f"workers.program-out:{self.worker_id}:{self.stopped_at.text}"
