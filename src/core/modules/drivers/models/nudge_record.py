from datetime import timedelta
from engine.model.prunable import Prunable
from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class NudgeRecord(Prunable, Model):
    """How often one agent was told one line of a nudge, and when last."""

    kept_for = timedelta(days=7)

    model_name = "nudge_record"
    cli_name = "nudge-record"

    session_agent_id: int
    creator_id: int
    key: str
    text: str
    delivery_count: int = 0
    last_delivered_at: Timestamp | None = None
