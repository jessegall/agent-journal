from dataclasses import dataclass

from core.base.timestamp import Timestamp
from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.models.support.views import AGENT_LISTING_SELECT


@dataclass(frozen=True, kw_only=True)
class AgentListing(AgentCard):
    """An agent's card fields and creation time, read by both agents lists."""

    cli_name = "agent-listing"
    view = "agent_listing"
    key = "id"
    select = AGENT_LISTING_SELECT

    parent_id: int | None
    created_at: Timestamp
    updated_at: Timestamp
    process_started_at: Timestamp | None
