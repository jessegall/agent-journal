from dataclasses import dataclass

from engine.model.view_model import ViewModel
from core.modules.drivers.models.support.views import AGENT_MESSAGE_TOTALS_SELECT


@dataclass(frozen=True, kw_only=True)
class MessageTotal(ViewModel):
    """How often an agent message was given to all agents and when it was given last, read from the agent_message_totals view."""

    cli_name = "agent-message-total"
    view = "agent_message_totals"
    key = "agent_message_key"
    select = AGENT_MESSAGE_TOTALS_SELECT

    agent_message_key: str
    delivery_count: int
    last_delivered_at: str
