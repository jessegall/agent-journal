from dataclasses import dataclass

from core.base.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.accounts.models.enums.person_factor_type import PersonFactorType


@dataclass(frozen=True, kw_only=True)
class PersonFactor(Model):
    """A passkey or an authenticator app a person proves a second time with at login."""

    model_name = "person_factor"
    cli_name = "person-factor"
    hidden_fields = frozenset({"credential"})

    creator_id: int
    person_id: int
    factor_type: PersonFactorType
    label: str
    credential: str
    removed_at: Timestamp | None = None
