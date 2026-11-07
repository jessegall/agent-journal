from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class NudgeRecord(Model):
    """How often one agent was told one line of a nudge, and when last."""

    model_name = "nudge_record"
    cli_name = "nudge-record"

    session_agent_id: int
    creator_id: int
    key: str
    text: str
    delivery_count: int = 0
    last_delivered_at: Timestamp | None = None
