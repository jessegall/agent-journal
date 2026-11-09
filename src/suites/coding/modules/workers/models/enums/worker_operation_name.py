from enum import StrEnum

from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

WORKER_OPERATION_NEXT = NudgeDeclaration("workers.operation_next", NudgeType.STEERING,
    'task:{task} is yours next; output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_TESTS = NudgeDeclaration("workers.operation_tests", NudgeType.STEERING,
    'task:{task} tests queued: this hand-in is done, so you can run tests yourself now, or stop; output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_CONFLICT = NudgeDeclaration("workers.operation_conflict", NudgeType.STEERING,
    'worker:{worker} has a merge conflict: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_MERGED = NudgeDeclaration("workers.operation_merged", NudgeType.STEERING,
    'worker:{worker} merged: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_JOB = NudgeDeclaration("workers.operation_job", NudgeType.STEERING,
    'worker:{worker} has the job: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_DELIVERED = NudgeDeclaration("workers.operation_delivered", NudgeType.STEERING,
    'worker:{worker} handed in its task: output {output}', turn_limited=False, wakes_agent=True)


class WorkerOperationName(StrEnum):
    NEXT = "next"
    DELIVER = "deliver"
    JOB = "send"
    MERGE = "merge"

    @property
    def is_handoff(self) -> bool:
        return self in (self.NEXT, self.DELIVER)

    def finished_nudge(self, worker_id: int, process_id: int) -> Nudge:
        match self:
            case self.MERGE:
                return WORKER_OPERATION_MERGED.nudge(worker=worker_id, output=process_id)
            case self.JOB:
                return WORKER_OPERATION_JOB.nudge(worker=worker_id, output=process_id)
            case self.NEXT | self.DELIVER:
                return WORKER_OPERATION_DELIVERED.nudge(worker=worker_id, output=process_id)
