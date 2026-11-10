from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class LoginAttempt(Model):
    """One try at logging in, counted by address digest and name to slow a guesser down."""

    model_name = "login_attempt"
    cli_name = "login-attempt"
    hidden_fields = frozenset({"address_digest"})

    creator_id: int
    address_digest: str
    name: str
    attempted_at: Timestamp
