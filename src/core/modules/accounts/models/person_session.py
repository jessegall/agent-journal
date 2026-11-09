from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class PersonSession(Model):
    """One logged-in browser of a person; it keeps only the digest of its token, never the token."""

    model_name = "person_session"
    cli_name = "person-session"
    hidden_fields = frozenset({"token_digest"})

    creator_id: int
    person_id: int
    token_digest: str
    device: str
    address: str
    last_active_at: Timestamp
    factor_checked_at: Timestamp
    expires_at: Timestamp
    ended_at: Timestamp | None = None
