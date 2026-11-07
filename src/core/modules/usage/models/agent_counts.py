from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.modules.usage.models.support.views import AGENT_COUNTS_SELECT


@dataclass(frozen=True, kw_only=True)
class AgentCounts(EnvironmentScoped, ViewModel):
    """Agent counts grouped by role and profile."""

    cli_name = "agent-counts"
    view = "agent_counts"
    key = "role"
    select = AGENT_COUNTS_SELECT

    environment_id: int
    role: str
    profile: str
    kept: int
    running: int
