from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class UsedGrantRecord(Model):
    """The record that a hook admitted a journal command by spending a grant; the command's own entry point
    accepts it once in place of a second grant."""

    model_name = "used_grant_record"
    cli_name = "admission-receipt"

    session_agent_id: int
    event_id: str
    command_fingerprint: str
    policy_key: str
    grant_id: int
    consumed_at: Timestamp | None = None
