from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_START_FAILED = NudgeDeclaration("workers.start_failed", NudgeType.STEERING, 'worker:{worker} could not start: journal worker release {worker}, or see journal agent terminal', turn_limited=False)
LAUNCH_FAILURE_NUDGES = [WORKER_START_FAILED]


@dataclass(frozen=True)
class RecordWorkerLaunchFailure(Command[None]):
    """Records that a worker's program could not start."""

    worker_id: int
