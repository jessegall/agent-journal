from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class RecoveryCode(Model):
    """A code that stands in once for a person's lost factor; it keeps only the code's digest."""

    model_name = "recovery_code"
    cli_name = "recovery-code"
    hidden_fields = frozenset({"code_digest"})

    creator_id: int
    person_id: int
    code_digest: str
    used_at: Timestamp | None = None
