from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.support.views import AGENT_ACTIVITIES_SELECT


@dataclass(frozen=True, kw_only=True)
class AgentActivity(ViewModel):
    """An agent's last hook other than a tick, with its creation and end times."""

    cli_name = "agent-activity"
    view = "agent_activities"
    key = "id"
    select = AGENT_ACTIVITIES_SELECT

    id: int
    parent_id: int | None
    created_at: Timestamp
    ended_at: Timestamp | None
    last_hook_at: Timestamp | None

    def is_inactive(self, timestamp: Timestamp, seconds: int) -> bool:
        activity_at = self.last_hook_at if self.last_hook_at is not None else self.created_at
        return activity_at.elapsed_seconds(timestamp) >= seconds
