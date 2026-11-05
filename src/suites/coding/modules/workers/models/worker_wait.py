from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from suites.coding.modules.workers.models.support.views import WORKER_WAITS_SELECT


@dataclass(frozen=True, kw_only=True)
class WorkerWait(EnvironmentScoped, ViewModel):
    """The reason a worker waits, from its current worktree, tasks and proofs."""

    cli_name = "worker-wait"
    view = "worker_waits"
    key = "agent_id"
    select = WORKER_WAITS_SELECT
    shared_rows = True

    agent_id: int
    environment_id: int
    reason: str
