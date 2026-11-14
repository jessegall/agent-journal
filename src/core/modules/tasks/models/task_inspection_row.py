from dataclasses import dataclass

from engine.model.view_model import ViewModel
from core.modules.tasks.models.support.views import TASK_INSPECTIONS_SELECT


@dataclass(frozen=True, kw_only=True)
class TaskInspectionRow(ViewModel):
    """What a task waits on, its latest hundred log lines newest first and the waits still open, each a JSON
    list, and the agent it is queued for or held by, read from the task_inspections view."""

    cli_name = "task-inspection"
    view = "task_inspections"
    key = "task_id"
    select = TASK_INSPECTIONS_SELECT

    task_id: int
    tags: tuple[str, ...]
    waits: str
    logs: str
    openers: str
    block_renewals: str
    helper_id: int | None
    helper_name: str | None
    helper_main: bool
