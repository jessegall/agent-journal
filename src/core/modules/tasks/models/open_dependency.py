from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.tasks.models.support.views import OPEN_DEPENDENCIES_SELECT


@dataclass(frozen=True, kw_only=True)
class OpenDependency(ViewModel):
    """A task's wait on a task not yet closed, read from the open_dependencies view; a completed or cancelled task
    holds nothing back."""

    cli_name = "open-dependency"
    view = "open_dependencies"
    key = "id"
    select = OPEN_DEPENDENCIES_SELECT

    id: int
    task_id: int
    dependency_id: int
