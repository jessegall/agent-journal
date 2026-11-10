from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.support.views import WORKER_PROGRESS_SELECT


@dataclass(frozen=True, kw_only=True)
class WorkerProgress(EnvironmentScoped, ViewModel):
    """Task totals and elapsed time for a worker's latest worktree."""

    cli_name = "worker-progress"
    view = "worker_progress"
    key = "agent_id"
    select = WORKER_PROGRESS_SELECT
    shared_rows = True

    agent_id: int
    environment_id: int
    branch: str
    task_id: int
    started_at: Timestamp
    finished_at: Timestamp | None
    task_count: int
    completed_count: int
