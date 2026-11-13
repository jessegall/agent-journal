from enum import StrEnum

from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

WORKER_OPERATION_NEXT = NudgeDeclaration("workers.operation_next", NudgeType.STEERING,
    'task:{task} is yours next; output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_TESTS = NudgeDeclaration("workers.operation_tests", NudgeType.STEERING,
    "task:{task} tests queued: this commit is done, so run tests yourself or stop; output {output}", turn_limited=False, wakes_agent=True)
WORKER_OPERATION_CONFLICT = NudgeDeclaration("workers.operation_conflict", NudgeType.STEERING,
    'worker:{worker} has a merge conflict: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_MERGED = NudgeDeclaration("workers.operation_merged", NudgeType.STEERING,
    'worker:{worker} merged: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_JOB = NudgeDeclaration("workers.operation_job", NudgeType.STEERING,
    'worker:{worker} has the job: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_PAUSED = NudgeDeclaration("workers.operation_paused", NudgeType.STEERING,
    "worker:{worker} is paused: the job waits until it is resumed", turn_limited=False, wakes_agent=True)
WORKER_OPERATION_COMMITTED = NudgeDeclaration("workers.operation_committed", NudgeType.STEERING,
    'worker:{worker} committed its work: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_STARTED = NudgeDeclaration("workers.operation_started", NudgeType.STEERING,
    'worker:{worker} started its next task: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_UPDATED = NudgeDeclaration("workers.operation_updated", NudgeType.STEERING,
    'worker:{worker} is up to date: output {output}', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_UPDATE_CONFLICT = NudgeDeclaration("workers.operation_update_conflict", NudgeType.STEERING,
    'worker:{worker} update clashes: output {output}; settle the conflict markers, then commit', turn_limited=False, wakes_agent=True)
WORKER_OPERATION_UPDATE_FAILED = NudgeDeclaration("workers.operation_update_failed", NudgeType.STEERING,
    'worker:{worker} update failed and changed nothing: output {output}', turn_limited=False, wakes_agent=True)


class WorkerOperationName(StrEnum):
    NEXT = "next"
    COMMIT = "commit"
    JOB = "send"
    MERGE = "merge"
    UPDATE = "update"

    @property
    def is_handoff(self) -> bool:
        return self is self.COMMIT

    def finished_nudge(self, worker_number: int, process_id: int) -> Nudge:
        match self:
            case self.MERGE:
                return WORKER_OPERATION_MERGED.nudge(worker=worker_number, output=process_id)
            case self.JOB:
                return WORKER_OPERATION_JOB.nudge(worker=worker_number, output=process_id)
            case self.NEXT:
                return WORKER_OPERATION_STARTED.nudge(worker=worker_number, output=process_id)
            case self.COMMIT:
                return WORKER_OPERATION_COMMITTED.nudge(worker=worker_number, output=process_id)
            case self.UPDATE:
                return WORKER_OPERATION_UPDATED.nudge(worker=worker_number, output=process_id)
