from dataclasses import dataclass

from core.base.actor_type import ActorType
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from core.modules.messages.support.work_source_copy import WorkSourceCopy


@dataclass(frozen=True, kw_only=True)
class WorkerOperation(Model):
    """A worker command accepted for execution by the process queue."""

    model_name = "worker_operation"
    cli_name = "worker-operation"
    shared_rows = True

    worker_id: int
    creator_id: int
    actor_type: ActorType
    process_id: int
    line: str
    name: WorkerOperationName
    source_message_id: int | None
    source_version: int
    source_unavailable: bool
    selecting_actor_id: int | None
    source_origin: str
    plugin_script: str = ""
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None

    @property
    def recipient_id(self) -> int:
        return self.creator_id if self.actor_type is ActorType.AGENT else self.worker_id

    def source_copy(self, environment_id: int) -> WorkSourceCopy:
        return WorkSourceCopy(self.source_message_id, self.source_version, environment_id,
                              self.source_unavailable, self.selecting_actor_id, self.source_origin)
