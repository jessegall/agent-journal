from enum import StrEnum

from engine.driver.agent_message import AgentMessage
from suites.coding.modules.workers.nudges.worker_operation_merged_message import WorkerOperationMergedMessage
from suites.coding.modules.workers.nudges.worker_operation_job_message import WorkerOperationJobMessage
from suites.coding.modules.workers.nudges.worker_operation_committed_message import WorkerOperationCommittedMessage
from suites.coding.modules.workers.nudges.worker_operation_started_message import WorkerOperationStartedMessage
from suites.coding.modules.workers.nudges.worker_operation_updated_message import WorkerOperationUpdatedMessage


class WorkerOperationName(StrEnum):
    NEXT = "next"
    COMMIT = "commit"
    JOB = "send"
    MERGE = "merge"
    UPDATE = "update"

    @property
    def is_handoff(self) -> bool:
        return self is self.COMMIT

    def finished_nudge(self, worker_number: int, process_id: int) -> AgentMessage:
        match self:
            case self.MERGE:
                return WorkerOperationMergedMessage.declared().nudge(worker=worker_number, output=process_id)
            case self.JOB:
                return WorkerOperationJobMessage.declared().nudge(worker=worker_number, output=process_id)
            case self.NEXT:
                return WorkerOperationStartedMessage.declared().nudge(worker=worker_number, output=process_id)
            case self.COMMIT:
                return WorkerOperationCommittedMessage.declared().nudge(worker=worker_number, output=process_id)
            case self.UPDATE:
                return WorkerOperationUpdatedMessage.declared().nudge(worker=worker_number, output=process_id)
