from enum import StrEnum

from engine.driver.agent_message import AgentMessage
from suites.coding.modules.workers.agent_messages.worker_operation_merged_message import WorkerOperationMergedMessage
from suites.coding.modules.workers.agent_messages.worker_operation_job_message import WorkerOperationJobMessage
from suites.coding.modules.workers.agent_messages.worker_operation_committed_message import WorkerOperationCommittedMessage
from suites.coding.modules.workers.agent_messages.worker_operation_started_message import WorkerOperationStartedMessage
from suites.coding.modules.workers.agent_messages.worker_operation_updated_message import WorkerOperationUpdatedMessage


class WorkerOperationName(StrEnum):
    NEXT = "next"
    COMMIT = "commit"
    JOB = "send"
    MERGE = "merge"
    UPDATE = "update"

    @property
    def is_handoff(self) -> bool:
        return self is self.COMMIT

    def finished_agent_message(self, worker_number: int, process_id: int) -> AgentMessage:
        match self:
            case self.MERGE:
                return WorkerOperationMergedMessage.declared().agent_message(worker=worker_number, output=process_id)
            case self.JOB:
                return WorkerOperationJobMessage.declared().agent_message(worker=worker_number, output=process_id)
            case self.NEXT:
                return WorkerOperationStartedMessage.declared().agent_message(worker=worker_number, output=process_id)
            case self.COMMIT:
                return WorkerOperationCommittedMessage.declared().agent_message(worker=worker_number, output=process_id)
            case self.UPDATE:
                return WorkerOperationUpdatedMessage.declared().agent_message(worker=worker_number, output=process_id)
