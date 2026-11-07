from dataclasses import dataclass

from core.base.actor_type import ActorType
from core.base.model.model import Model
from core.base.timestamp import Timestamp


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
    plugin_script: str = ""
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None
