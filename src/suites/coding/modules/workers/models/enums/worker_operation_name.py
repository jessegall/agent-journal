from enum import StrEnum

from engine.driver.nudge import Nudge
from suites.coding.modules.workers.nudges.worker_operation_merged_nudge import WorkerOperationMergedNudge
from suites.coding.modules.workers.nudges.worker_operation_job_nudge import WorkerOperationJobNudge
from suites.coding.modules.workers.nudges.worker_operation_committed_nudge import WorkerOperationCommittedNudge
from suites.coding.modules.workers.nudges.worker_operation_started_nudge import WorkerOperationStartedNudge
from suites.coding.modules.workers.nudges.worker_operation_updated_nudge import WorkerOperationUpdatedNudge


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
                return WorkerOperationMergedNudge.declared().nudge(worker=worker_number, output=process_id)
            case self.JOB:
                return WorkerOperationJobNudge.declared().nudge(worker=worker_number, output=process_id)
            case self.NEXT:
                return WorkerOperationStartedNudge.declared().nudge(worker=worker_number, output=process_id)
            case self.COMMIT:
                return WorkerOperationCommittedNudge.declared().nudge(worker=worker_number, output=process_id)
            case self.UPDATE:
                return WorkerOperationUpdatedNudge.declared().nudge(worker=worker_number, output=process_id)
