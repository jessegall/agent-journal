from dataclasses import dataclass

from engine.model.view_model import ViewModel
from core.modules.tasks.models.support.views import ENVIRONMENT_CARDS_SELECT


@dataclass(frozen=True, kw_only=True)
class EnvironmentCard(ViewModel):
    """An environment with its running agents and its unfinished tasks, read from the environment_cards view.
    """

    cli_name = "environment"
    view = "environment_cards"
    key = "id"
    select = ENVIRONMENT_CARDS_SELECT

    id: int
    name: str
    folder: str
    branch: str
    running_agent_count: int
    unfinished_task_count: int
