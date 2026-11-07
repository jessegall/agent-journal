from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class WorkerAssignment(EnvironmentScoped, Model):
    """Tasks given to a worker together."""

    model_name = "worker_assignment"
    cli_name = "worker-assignment"

    environment_id: int = 0
    worker_id: int
    creator_id: int
    task_ids: str
