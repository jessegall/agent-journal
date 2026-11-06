from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class RefusalSkip(Model):
    """An agent passing one refusal once, with its reason, and how many refusals in a row it has passed so."""

    model_name = "refusal_skip"
    cli_name = "refusal-skip"
    shared_rows = True

    session_agent_id: int
    creator_id: int
    name: str
    reason: str
    streak: int = 1
    used_at: Timestamp | None = None
    restored_at: Timestamp | None = None
