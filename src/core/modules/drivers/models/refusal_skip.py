from dataclasses import dataclass

from core.base.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class RefusalSkip(Model):
    """An agent passing one refusal once, with its reason, and how many refusals in a row it has passed so. A skip
    is held until the agent confirms it with what it tried instead, or withdraws it; either answer is final."""

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
    confirmed_at: Timestamp | None = None
    cancelled_at: Timestamp | None = None
    tried: str = ""
    needs_approval: bool = False
    approved_at: Timestamp | None = None

    @property
    def is_answered(self) -> bool:
        return self.confirmed_at is not None or self.cancelled_at is not None
