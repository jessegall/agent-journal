from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class SetupCode(Model):
    """The one-time code the owner of a new hosted journal sets it up with; it keeps only the digest."""

    model_name = "setup_code"
    cli_name = "setup-code"
    hidden_fields = frozenset({"code_digest"})

    creator_id: int
    code_digest: str
    expires_at: Timestamp
    used_at: Timestamp | None = None
