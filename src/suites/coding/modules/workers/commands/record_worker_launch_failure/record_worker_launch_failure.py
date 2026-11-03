from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_START_FAILED = NudgeDeclaration("workers.start_failed", NudgeType.STEERING, 'worker:{worker} could not start: journal worker release {worker}, or see journal agent terminal', turn_limited=False)


@dataclass(frozen=True)
class RecordWorkerLaunchFailure(Command[None]):
    worker_id: int
