from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.modules.usage.models.support.views import AGENT_FILTER_OPTIONS_SELECT


@dataclass(frozen=True, kw_only=True)
class AgentFilterOptionsView(EnvironmentScoped, ViewModel):
    cli_name = "agent-filter-options"
    view = "agent_filter_options"
    key = "environment_id"
    select = AGENT_FILTER_OPTIONS_SELECT

    environment_id: int
    roles: str
    profiles: str
