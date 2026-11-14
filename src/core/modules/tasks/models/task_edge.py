from dataclasses import dataclass

from engine.model.view_model import ViewModel
from core.modules.tasks.models.support.views import TASK_EDGES_SELECT


@dataclass(frozen=True, kw_only=True)
class TaskEdge(ViewModel):
    """One task waiting on another, by a dependency or a block on it, read from the task_edges view."""

    cli_name = "task"
    view = "task_edges"
    key = "task_id"
    select = TASK_EDGES_SELECT

    task_id: int
    blocker_id: int
