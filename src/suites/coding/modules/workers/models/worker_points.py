from dataclasses import dataclass

from engine.model.view_model import ViewModel
from suites.coding.modules.workers.models.support.views import WORKER_POINTS_SELECT


@dataclass(frozen=True, kw_only=True)
class WorkerPoints(ViewModel):
    """A worker's worktree with its task's title and brief and its proofs as one JSON list, read from the
    worker_points view."""

    cli_name = "worker-points"
    shared_rows = True
    view = "worker_points"
    key = "worktree_id"
    select = WORKER_POINTS_SELECT

    worktree_id: int
    session_agent_id: int
    task_title: str
    task_brief: str
    proofs: str
